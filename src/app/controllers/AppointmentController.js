import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, addHours, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

import Notification from '../schemas/Notification';

const PAGINATION_SIZE = 20;
const pageOffset = page => (page - 1) * PAGINATION_SIZE;

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
      limit: PAGINATION_SIZE,
      offset: pageOffset(page),
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date, provider_id } = req.body;

    if (provider_id === req.userId) {
      return res.status(401).json({ error: 'Invalid provider' });
    }

    const provider = await User.findByPk(provider_id);
    if (!provider) {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are invalid' });
    }

    /**
     * Check min hour do book
     */
    const oneHourInAdvance = addHours(new Date(), 1);
    if (isBefore(hourStart, oneHourInAdvance)) {
      return res
        .status(400)
        .json({ error: 'Appointment date must be 1h in advance' });
    }

    /**
     * Check provider's availability
     */
    const providerIsBusy = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (providerIsBusy) {
      return res.status(400).json({ error: 'Date is not available' });
    }

    const appointment = await Appointment.create({
      date: hourStart,
      provider_id,
      user_id: req.userId,
    });

    /**
     * Notify provider
     */
    const user = await User.findByPk(req.userId);
    const formatedDate = format(hourStart, "'dia' dd 'de' MMMM 'às' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formatedDate}`,
      user: provider_id,
    });

    return res.json({ appointment });
  }
}

export default new AppointmentController();

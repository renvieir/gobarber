import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const provider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!provider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const parsedDate = parseISO(req.query.date);
    const schedule = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });
    return res.json(schedule);
  }
}

export default new ScheduleController();

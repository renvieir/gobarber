import { badRequest } from '../helpers/httpResponse';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'provider'],
    });
    return res.json({ users });
  }

  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) return badRequest(res, 'User already exists');

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && user.email !== email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists)
        return badRequest(res, 'Email already in use by another user');
    }

    if (oldPassword && !(await user.passwordMatch(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, email: mail, provider } = await user.update(req.body);

    return res.json({ id, name, email: mail, provider });
  }
}

export default new UserController();

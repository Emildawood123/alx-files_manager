import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).send({ error: 'Missing password' });
    }
    const isExist = await dbClient.findUser({ email });
    if (isExist) {
      return res.status(400).send({ error: 'Already exist' });
    }
    const user = await dbClient.insertUser({
      email,
      password: sha1(password),
    });
    return res.status(201).send({ id: user.id, email });
  }
}
export default UsersController;

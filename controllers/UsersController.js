import crypto from 'crypto';
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
    const dataBase = dbClient.client.db().collection('users');
    const isExist = await dataBase.find({ email }).toArray();
    if (isExist.length !== 0) {
      return res.status(400).send({ error: 'Already exist' });
    }
    const user = await dataBase.insertOne({
      email,
      password: crypto
        .createHash('sha1')
        .update(password)
        .digest('hex'),
    });
    return res.status(201).send({ id: user.insertId, email });
  }
}
export default UsersController;

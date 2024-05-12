import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

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
      password: sha1(password),
    });
    return res.status(201).send({ id: user.insertedId, email });
  }

  static async getMe(req, res) {
    const token = req.header('X-Token');
    const userid = await redisClient.get(`auth_${token}`);
    if (!userid) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const collection = dbClient.client.db().collection('users');
    const findUser = await collection.findOne({ _id: ObjectId(userid) });
    if (!findUser) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    return res.status(200).send({ id: findUser._id, email: findUser.email });
  }
}
export default UsersController;

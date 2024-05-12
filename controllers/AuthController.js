import sha1 from 'sha1';
import { uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.header('Authorization').split(' ')[1];
    const [email, password] = Buffer.from(authHeader, 'base64').toString('ascii').split(':');
    const users = await dbClient.client.db().collection('users');
    const user = await users.find({ email, password: sha1(password) }).toArray();
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const token = uuidv4();
    const key = `auth_${token}`;
    redisClient.set(key, user[0]._id.toString(), 86400);
    return res.status(200).send({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    const userid = await redisClient.get(`auth_${token}`);
    if (!userid) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    await redisClient.del(token);
    return res.status(204).send();
  }
}
export default AuthController;

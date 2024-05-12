import sha1 from 'sha1';
import { uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.header('Authorization').split(' ')[1];
    const [email, password] = Buffer.from(authHeader).toString('base64').split(':');
    const users = await dbClient.client.db().collection();
    const user = users.find({ email, password: sha1(password) }).toArray();
    if (user.length < 1) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const token = uuidv4();
    const key = `Auth_${token}`;
    redisClient.set(key, user._id.toString(), 24 * 60 * 60);
    return res.status(200).send({ token: `${token}` });
  }

  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    const userid = await redisClient.get(`Auth_${token}`);
    if (!userid) res.status(401).send({ error: 'Unauthorized' });
    await redisClient.del(token);
    return res.status(204).send();
  }
}
export default AuthController;

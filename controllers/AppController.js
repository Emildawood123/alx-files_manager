import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static async getStatus(req, res) {
    return res.status(200).send({
      redis: redisClient.isAlive(),
      db: await dbClient.isAlive(),
    });
  }

  static async getStats(req, res) {
    return res.status(200).send({
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    });
  }
}
export default AppController;

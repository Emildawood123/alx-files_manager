import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(req, res) {
    if (redisClient.isAlive() && dbClient.isAlive()) {
      res.status(200).send({
        redis: redisClient.isAlive(),
        db: dbClient.isAlive(),
      });
    }
  }

  static async getStats(req, res) {
    res.status(200).send({
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    });
  }
}
export default AppController;

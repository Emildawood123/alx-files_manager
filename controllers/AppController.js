import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(req, res) {
    res.send({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  static getStats(req, res) {
    res.send({
      users: dbClient.nbUsers(),
      files: dbClient.nbFiles(),
    });
  }
}
export default AppController;

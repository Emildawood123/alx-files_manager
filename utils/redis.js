import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => console.log('Redis Client Error', err));
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const value = promisify(this.client.get).bind(this.client);
    return value(key);
  }

  async set(key, v, d) {
    const value = promisify(this.client.set).bind(this.client);
    await value(key, v);
    await this.client.expire(key, d);
  }

  async del(key) {
    const value = promisify(this.client.del).bind(this.client);
    await value(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;

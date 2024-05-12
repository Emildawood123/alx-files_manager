import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  static async postUpload(res, req) {
    let data;
    const token = req.header('X-Token');
    const userid = await redisClient.get(`auth_${token}`);
    if (!userid) {
      res.status(401).send({ error: 'Unauthorized' });
    }
    const filename = req.body.name;
    const { type } = req.body;
    const parentId = req.body.parentId || 0;
    if (!filename) {
      return res.status(400).send({ error: 'Missing name' });
    }
    if (!type || type !== 'file' || type !== 'folder' || type !== 'image') {
      return res.status(400).send({ error: 'Missing type' });
    }
    if (type === 'file' || type === 'image') {
      // eslint-disable-next-line
      data = atob(req.body.data);
    }
    if (!data && type !== 'folder') {
      return res.status(400).send({ error: 'Missing data' });
    }
    if (parentId) {
      const collection = dbClient.client.db().collection('files');
      const parentNode = collection.findOne({ id: parentId });
      if (!parentNode) {
        return res.status(400).send('Parent not found');
      }
      if (parentId && type !== 'folder') {
        return res.status(400).send('Parent is not a folder');
      }
    }
    return res.status(200);
  }
}
export default FilesController;

class FilesController {
    static async postUpload(res, req) {
        const token = req.header('X-Token')
        const userid = await redisClient.get(`auth_${token}`);
        if (!userid) {
            res.status(401).send({ error: 'Unauthorized' })
        }
    }
}
export default FilesController
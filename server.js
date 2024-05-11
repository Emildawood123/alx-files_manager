import Express from 'express';
import router from './routes';

const app = Express();

const PORT = 5000;
app.use(router);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

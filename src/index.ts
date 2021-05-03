import awaitToJs from 'await-to-js';
import config from './config';
import app from './app';
import connectDB from './connectDB';
const { PORT } = config;

app.listen(PORT, async() => {
  const[error] = await awaitToJs(connectDB());
   if(error) {
    console.log('Error connection DB ',error);
    return;
   }
    return console.log(`server is listening on ${PORT}`);
  });

export default app;

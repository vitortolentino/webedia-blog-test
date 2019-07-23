import 'dotenv-safe/config';
import app from './app';

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Server is listen on ${process.env.SERVER_PORT}`)
);

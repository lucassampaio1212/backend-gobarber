import 'reflect-metadata';
import 'dotenv/config';
import express,{Request,Response,NextFunction} from 'express';
import { errors } from 'celebrate';
import routes from './routes';
import cors from 'cors';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import '@shared/container'
import '@shared/infra/typeorm';
const app = express();
app.use(cors())
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }
  console.error(err);
  return response
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});


app.listen(3339,() => {
    console.log("Back-End Initialized On Port 3339")
})

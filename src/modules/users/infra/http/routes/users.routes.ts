import {Router} from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import uploadConfig from '@config/upload';
import multer from 'multer';
const usersRouter = Router();
const upload = multer(uploadConfig);
import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';


const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post('/',usersController.create);

usersRouter.patch('/avatar',ensureAuthenticated,upload.single('avatar'), userAvatarController.update);
export default usersRouter;

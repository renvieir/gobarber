import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

import {
  validateCreateUser,
  validateUpdateUser,
  validateCreateSession,
  validateCreateAppointment,
} from './app/validators';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', validateCreateSession, SessionController.store);
routes.post('/users', validateCreateUser, UserController.store);

routes.use(authMiddleware);
routes.put('/users', validateUpdateUser, UserController.update);
routes.get('/users', UserController.index);

routes.get('/providers', ProviderController.index);

routes.get('/appointments', AppointmentController.index);
routes.post(
  '/appointments',
  validateCreateAppointment,
  AppointmentController.store
);

routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;

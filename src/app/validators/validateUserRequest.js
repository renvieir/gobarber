import * as Yup from 'yup';
import { validateSchema } from '../helpers/validateSchema';

export async function validateCreateUser(req, res, next) {
  await validateSchema(schema, req, res, next);
}

export async function validateUpdateUser(req, res, next) {
  const schema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string().email(),
    oldPassword: Yup.string().min(6),
    password: Yup.string()
      .min(6)
      .when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
    confirmPassword: Yup.string()
      .min(6)
      .when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
  });
  await validateSchema(schema, req, res, next);
}

import * as Yup from 'yup';
import { validateSchema } from '../helpers/validateSchema';

export async function validateCreateSession(req, res, next) {
  const schema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required(),
    password: Yup.string().required(),
  });
  await validateSchema(schema, req, res, next);
}

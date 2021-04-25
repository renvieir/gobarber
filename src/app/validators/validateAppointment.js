import * as Yup from 'yup';
import { validateSchema } from '../helpers/validateSchema';

export async function validateCreateAppointment(req, res, next) {
  const schema = Yup.object().shape({
    date: Yup.date().required(),
    provider_id: Yup.number().required(),
  });
  await validateSchema(schema, req, res, next);
}

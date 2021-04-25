import { badRequest } from './httpResponse';

export async function validateSchema(schema, req, res, next) {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return badRequest(res, 'Validation fails');
  }
}

export function badRequest(res, error) {
  return res.status(400).json({ error });
}

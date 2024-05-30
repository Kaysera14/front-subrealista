import { METHODS, sendApiRequest } from "./send-api-request.js";

export async function manageRentals(id, status) {
  return sendApiRequest(METHODS.PATCH, `/myrentings/${id}`, status);
}

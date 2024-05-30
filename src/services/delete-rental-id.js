import { METHODS, sendApiRequest } from "./send-api-request.js";

export async function deleteRental(id) {
  return sendApiRequest(METHODS.DELETE, `/myrentals/${id}/delete`);
}

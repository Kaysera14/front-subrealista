import { METHODS, sendApiRequest } from "./send-api-request.js";

export async function getUsersRentals() {
  return sendApiRequest(METHODS.GET, "/myrentings");
}

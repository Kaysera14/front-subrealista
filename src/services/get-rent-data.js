import { METHODS, sendApiRequest } from "./send-api-request.js";

export async function getRentData(rent_id) {
  return sendApiRequest(METHODS.GET, "/rentings/" + rent_id);
}

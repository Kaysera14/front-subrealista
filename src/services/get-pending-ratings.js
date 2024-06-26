import { METHODS, sendApiRequest } from "./send-api-request.js";

export async function getPendingRatings(username) {
  return sendApiRequest(METHODS.GET, `/users/${username}/ratings/pending`);
}

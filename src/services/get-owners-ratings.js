import { METHODS, sendApiRequest } from "./send-api-request.js";

export async function getOwnersRatings(username) {
	return sendApiRequest(METHODS.GET, `/users/${username}/ratings/rentals`);
}

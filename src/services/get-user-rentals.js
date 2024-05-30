import { METHODS, sendApiRequest } from "./send-api-request.js";

export async function getMyRentals() {
	return sendApiRequest(METHODS.GET, "/myrentals");
}

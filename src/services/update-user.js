export async function updateUser(userName, userData, token) {
  const response = await fetch(
    `${import.meta.env.VITE_APP_BACKEND}/users/${userName}`,
    {
      method: "PUT",
      body: userData,
      headers: {
        Authorization: token,
      },
    }
  );
  const json = await response.json();

  if (json?.status !== "ok") {
    throw new Error(json.message);
  }
  return json;
}

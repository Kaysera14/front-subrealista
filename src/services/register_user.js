export async function registerUser(userData) {
  const response = await fetch(`${import.meta.env.VITE_APP_BACKEND}/register`, {
    method: "POST",
    body: userData,
  });
  const json = await response.json();

  if (json?.status !== "ok") {
    return json;
  }
  return json;
}

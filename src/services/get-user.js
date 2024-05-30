export const getUserDataService = async (username) => {
  const response = await fetch(
    `${import.meta.env.VITE_APP_BACKEND}/users/${username}`
  );
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

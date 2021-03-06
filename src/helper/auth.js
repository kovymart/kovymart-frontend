const LOCAL_STORAGE_ACCESS_TOKEN = "access_token";

export const setAccessTokenToLocalStorage = (accessToken) => {
  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, accessToken);
};

export const getAccessTokenFromLocalStorage = () =>
  localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);

export const checkAuth = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);

  if (!token) {
    return false;
  }

  return true;
};

export const clearAccessToken = () =>
  localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);

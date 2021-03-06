// if use third party such as firebase, no need to create this
import { User } from "types/User";
const apiUrl = process.env.REACT_APP_API_URL;

const localStorageKey = "__auth_provider_token__";

export const getToken = () => window.localStorage.getItem(localStorageKey);

export const handleUserResponse = ({ user }: { user: User }) => {
  window.localStorage.setItem(localStorageKey, user.token || "");
  return user;
};

export const login = (data: { username: string; password: string }) => {
  return fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (response) => {
    const res = await response.json();
    if (response.ok) {
      return handleUserResponse(res);
    }
    return Promise.reject(res);
  });
};

export const register = (data: { username: string; password: string }) => {
  return fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (response) => {
    const res = await response.json();
    if (response.ok) {
      return handleUserResponse(res);
    }
    return Promise.reject(res);
  });
};

export const logout = async () => {
  window.localStorage.removeItem(localStorageKey);
};

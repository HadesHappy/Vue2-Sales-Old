import { getParsedLocalStorageItem } from "@/helpers/localStorage.helper";

export function authHeader() {
  // return authorization header with jwt token
  const user =
    getParsedLocalStorageItem("impersonatedUser") ||
    getParsedLocalStorageItem("user");

  if (user && user.access_token) {
    return { Authorization: `${user.token_type} ${user.access_token}` };
  } else {
    return {};
  }
}

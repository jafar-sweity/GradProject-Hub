export function storeToken(token: string) {
  localStorage.setItem("authToken", token);
}

export function getToken() {
  return localStorage.getItem("authToken"); // null if not found in localStorage , string if found  
}

export function removeToken() {
  localStorage.removeItem("authToken");
}

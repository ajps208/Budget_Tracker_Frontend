import API from "./api";

export function login(email, password) {
  return API.post("/auth/login", { email, password }).then((res) => res.data);
}

export function signup(name, email, password) {
  return API.post("/auth/signup", { name, email, password }).then(
    (res) => res.data
  );
}

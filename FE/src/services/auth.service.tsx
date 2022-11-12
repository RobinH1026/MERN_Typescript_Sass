import axios from "axios";

const API_URL = "http://localhost:7000/";

export const register = (username: string, email: string, password: string) => {
  return axios.post(API_URL + "register", {
    username,
    email,
    password,
  });
};

export const login = (email: string, password: string) => {
  return axios
    .post(API_URL + "login", {
        email,
        password,
    })
    .then((response) => {
        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data.token));
        }
        return response.data;
    });
};

export const logout = () => {
    localStorage.removeItem("user");
};

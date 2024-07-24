import axios from "axios";

const apiURL = import.meta.env.VITE_APP_AUTHAPI;

export default class AuthService {
  static async login(username, password) {
    const response = await axios.post(
      `http://127.0.0.1:4001/login`,
      {
        username: username,
        password: password,
      },
      {
        withCredentials: true,
      }
    );
    return response;
  }

  static async logout() {
    const response = await axios.post(`http://127.0.0.1:4001/logout`, {
      withCredentials: true,
    });
    return response;
  }
}

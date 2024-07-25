import axios from "axios";

const apiURL = import.meta.env.VITE_AUTHAPI;

export default class AuthService {
  static async login(username, password) {
    const response = await axios.post(
      `${apiURL}/login`,
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
    const response = await axios.post(`${apiURL}/logout`, {
      withCredentials: true,
    });
    return response;
  }
}

import axios from "axios";

export default class Data {
  static async getAllData() {
    const apiURL = import.meta.env.VITE_API;
    // try {
    //console.log(import.meta.env);
    // const response = await axios.get(`http://127.0.0.1:4000`);
    const response = await axios.get(`${import.meta.env.VITE_API}`);
    console.log("DATA", apiURL);
    //console.log(response);
    return response;
    // } catch (error) {
    //     console.log(error.message)
    // }
  }

  static async getOneModel(id) {
    const response = await axios.get(`${import.meta.env.VITE_API}/${id}`);
    return response.data;
  }
}

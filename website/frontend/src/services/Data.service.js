import data from "../../data/llms.json";
import axios from "axios";

const apiURL = import.meta.env.VITE_APP_API;

export default class Data{

    static async getAllData() {
        // try {
            //console.log(import.meta.env);
            const response = await axios.get(`http://127.0.0.1:4000`);
            //console.log(response);
            return response;
        // } catch (error) {
        //     console.log(error.message)
        // }
    }
    
    // static get() {
    //     const newData = {
    //         status: 200,
    //         data: data
    //     }
    //     return newData;
        
    // }

    static async getOneModel(id) {
        const response = await axios.get(`http://127.0.0.1:4000/${id}`); // add endpoint to fetch one LLM
        return response.data;
    }
}
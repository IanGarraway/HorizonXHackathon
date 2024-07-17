import data from "../../data/llms.json";



export default class Data{

    static get() {
        const newData = {
            status: 200,
            data: data
        }
        return newData;
        
    }

    // static getOneModel(id) {
    //     const response = await axios.get(`${import.meta.env.VITE_APP_API/id}`); // add endpoint to fetch one LLM
    //     return response.data;
    // }
}
import data from "../../data/llms.json";


export default class Data{

    static get() {
        const newData = {
            status: 200,
            data: data
        }
        return newData;
        
    }
}
import DataService from "../services/Data.Service.js";


export default class DataController{

    #dataService

    constructor(dataService = new DataService()) {
        this.#dataService = dataService;
    }

    getData = async (req, res) => {        
        try {            
            const data = await this.#dataService.getData(req);
                        
            return res.status(200).send(data);
        } catch (e) {
            
            return res.status(500).send({ message: e.message });
        }                
        
    }   
        
}
    

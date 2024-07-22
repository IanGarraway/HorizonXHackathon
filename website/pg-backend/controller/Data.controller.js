import DataService from "../service/Data.service.js";

export default class DataController {
  #dataService;

  constructor(dataService = new DataService()) {
    this.#dataService = dataService;
  }

  getData = async (req, res) => {    
    try {
      const modelsData = await this.#dataService.getData(req);

      return res.status(200).send(modelsData);
    } catch (e) {
      return res.status(500).send({ message: e.message });
    }
  };

  getOneData = async (req, res) => {
    const { id } = req.params;
    //console.log(req);
    try {
      const modelData = await this.#dataService.getOneData(id)
      return res.status(200).send(modelData);
    } catch (e) {
      return res.status(500).send({message: e.message})
    }
  }
}

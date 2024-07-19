import Database from "../database/Database.js";

export default class DataService {
  getData() {
    const dbClient = Database.getClient();
    dbClient.query(`SELECT * FROM dataTableName`, (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    });
  }
}

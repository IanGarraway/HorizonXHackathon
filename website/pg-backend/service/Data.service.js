import Database from "../database/Database.js";

export default class DataService {
  async getData() {

    const query = `
    SELECT *
    FROM de10_na_horizonx_model AS model
    FULL OUTER JOIN de10_na_horizonx_access AS a USING(access_id)
    FULL OUTER JOIN de10_na_horizonx_license AS license USING(license_id)
    FULL OUTER JOIN de10_na_horizonx_modality AS modality USING(modality_id)
    FULL OUTER JOIN de10_na_horizonx_size AS s USING(size_id)
    FULL OUTER JOIN de10_na_horizonx_type AS t USING(type_id)
    FULL OUTER JOIN de10_na_horizonx_model_dependencies AS dependencies USING(model_id)
    FULL OUTER JOIN de10_na_horizonx_model_organization AS organ USING(model_id);
  `;
    const dbClient = Database.getClient();
    try {
      const result = await dbClient.query(query)
      console.log(result.rows);
      return result.rows;
      
    } catch (e) {
      console.log(e.message);
    }
    
  }
}


// dbClient.query(query, (err, result) => {
//       if (!err) {
//         res.send(result.rows);
//       }
//     });
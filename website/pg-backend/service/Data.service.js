import Database from "../database/Database.js";

export default class DataService {
  async getData() {

    const query = `
    SELECT *
    FROM student.de10_na_horizonx_model
    JOIN student.de10_na_horizonx_access USING(access_id)
    JOIN student.de10_na_horizonx_license USING(license_id)
    JOIN student.de10_na_horizonx_modality USING(modality_id)
    JOIN student.de10_na_horizonx_size USING(size_id)
    JOIN student.de10_na_horizonx_type USING(type_id)
    JOIN student.de10_na_horizonx_model_dependencies USING(model_id)
    JOIN student.de10_na_horizonx_model_organization USING(model_id)
    JOIN student.de10_na_horizonx_dependencies USING(dependencies_id)
    JOIN student.de10_na_horizonx_organization USING(organization_id);
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
import Database from "../database/Database.js";

export default class DataService {
  async getData() {
    const newQuery = `SELECT 
    m.model_id, 
    m.name, 
    ARRAY_AGG(DISTINCT o.organization) AS organizations,
    ARRAY_AGG(DISTINCT d.dependencies) AS dependencies,
    m.description, 
    m.score_business_readiness, 
    m.score_perceived_value, 
    m.created_date, 
    m.url, 
    m.analysis, 
    m.quality_control, 
    m.intended_uses, 
    m.prohibited_uses, 
    m.monitoring, 
    m.feedback, 
    m.model_card, 
    m.training_emissions, 
    m.training_time, 
    m.training_hardware, 
    a.access, 
    l.license, 
    mo.modality,
    o.organization_logo_url,
    s.size
FROM student.de10_na_horizonx_model m
JOIN student.de10_na_horizonx_access a USING(access_id)
JOIN student.de10_na_horizonx_license l USING(license_id)
JOIN student.de10_na_horizonx_modality mo USING(modality_id)
JOIN student.de10_na_horizonx_size s USING(size_id)
JOIN student.de10_na_horizonx_type t USING(type_id)
JOIN student.de10_na_horizonx_model_dependencies md USING(model_id)
JOIN student.de10_na_horizonx_model_organization mo_org USING(model_id)
JOIN student.de10_na_horizonx_dependencies d USING(dependencies_id)
JOIN student.de10_na_horizonx_organization o USING(organization_id)
WHERE t.type = 'model'
GROUP BY 
    m.model_id, 
    m.name, 
    m.description, 
    m.score_business_readiness, 
    m.score_perceived_value, 
    m.created_date, 
    m.url, 
    m.analysis, 
    m.quality_control, 
    m.intended_uses, 
    m.prohibited_uses, 
    m.monitoring, 
    m.feedback, 
    m.model_card, 
    m.training_emissions, 
    m.training_time, 
    m.training_hardware, 
    a.access, 
    l.license, 
    mo.modality,
    o.organization_logo_url,
    s.size;
    `;

    const dbClient = Database.getClient();
    try {
      const result = await dbClient.query(newQuery);
      return result.rows;
    } catch (e) {
      console.log(e.message);
    }
  }

  async getOneData(id) {
    const newQuery = `SELECT 
    m.model_id, 
    m.name, 
    ARRAY_AGG(DISTINCT o.organization) AS organizations,
    ARRAY_AGG(DISTINCT d.dependencies) AS dependencies,
    m.description, 
    m.score_business_readiness, 
    m.score_perceived_value, 
    m.created_date, 
    m.url, 
    m.analysis, 
    m.quality_control, 
    m.intended_uses, 
    m.prohibited_uses, 
    m.monitoring, 
    m.feedback, 
    m.model_card, 
    m.training_emissions, 
    m.training_time, 
    m.training_hardware, 
    a.access, 
    l.license, 
    mo.modality,
    o.organization_logo_url,
    s.size
    FROM student.de10_na_horizonx_model m
    JOIN student.de10_na_horizonx_access a USING(access_id)
    JOIN student.de10_na_horizonx_license l USING(license_id)
    JOIN student.de10_na_horizonx_modality mo USING(modality_id)
    JOIN student.de10_na_horizonx_size s USING(size_id)
    JOIN student.de10_na_horizonx_type t USING(type_id)
    JOIN student.de10_na_horizonx_model_dependencies md USING(model_id)
    JOIN student.de10_na_horizonx_model_organization mo_org USING(model_id)
    JOIN student.de10_na_horizonx_dependencies d USING(dependencies_id)
    JOIN student.de10_na_horizonx_organization o USING(organization_id)
    WHERE t.type = 'model' AND m.model_id = ${id}
    GROUP BY 
      m.model_id, 
      m.name, 
      m.description, 
      m.score_business_readiness, 
      m.score_perceived_value, 
      m.created_date, 
      m.url, 
      m.analysis, 
      m.quality_control, 
      m.intended_uses, 
      m.prohibited_uses, 
      m.monitoring, 
      m.feedback, 
      m.model_card, 
      m.training_emissions, 
      m.training_time, 
      m.training_hardware, 
      a.access, 
      l.license, 
      mo.modality, 
      o.organization_logo_url,
      s.size;
    `;
    console.log(id, `<--`);
    const dbClient = Database.getClient();
    try {
      const result = await dbClient.query(newQuery);
      console.log(result);
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

import db from '../config/db.js';

// Get all services (can be filtered by business_id)
const getAllServices = async (business_id = null) => {
   let query = `SELECT s.*, b.name AS business_name FROM services s
                LEFT JOIN business_profile b ON s.business_id = b.id
                WHERE s.is_active = TRUE`;
   const params = [];
   
   if (business_id) {
      query += ` AND s.business_id = $1`;
      params.push(business_id);
   }

   query += ` ORDER BY s.created_at DESC`;
   const { rows } = await db.query(query, params);
   return rows;
};

// Get services for a specific business
const getServicesByBusiness = async (business_id) => {
   const { rows } = await db.query(
      `SELECT * FROM services
       WHERE business_id = $1 AND is_active = TRUE
       ORDER BY created_at DESC`,
      [business_id]
   );
   return rows;
};

const getServiceById = async (id) => {
   const { rows } = await db.query(
      `SELECT s.*, b.name AS business_name 
       FROM services s
       LEFT JOIN business_profile b ON s.business_id = b.id
       WHERE s.id = $1 AND s.is_active = TRUE`,
      [id]
   );
   return rows[0] || null;
};

const createService = async ({ business_id, service_name, description, price, duration_minutes }) => {
   const { rows } = await db.query(
      `INSERT INTO services (business_id, service_name, description, price, duration_minutes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [business_id || null, service_name, description, price, duration_minutes]
   );
   return rows[0];
};

const updateService = async (id, { service_name, description, price, duration_minutes, business_id }) => {
   let query = `UPDATE services
                SET service_name = $1, description = $2, price = $3, duration_minutes = $4
                WHERE id = $5 AND is_active = TRUE`;
   const params = [service_name, description, price, duration_minutes, id];

   if (business_id) {
      query = `UPDATE services
               SET service_name = $1, description = $2, price = $3, duration_minutes = $4
               WHERE id = $5 AND business_id = $6 AND is_active = TRUE`;
      params.push(business_id);
   }

   const { rows } = await db.query(query, params);
   return rows[0];
};

const deleteService = async (id, business_id = null) => {
   if (business_id) {
      await db.query(
         'UPDATE services SET is_active = FALSE WHERE id = $1 AND business_id = $2',
         [id, business_id]
      );
   } else {
      await db.query(
         'UPDATE services SET is_active = FALSE WHERE id = $1',
         [id]
      );
   }
};

export {
   getAllServices,
   getServicesByBusiness,
   getServiceById,
   createService,
   updateService,
   deleteService
};

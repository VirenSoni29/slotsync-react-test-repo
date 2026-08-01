import db from '../config/db.js';

const getAllServices = async () => {
   const { rows } = await db.query(
      `SELECT * FROM services
       WHERE is_active = TRUE
       ORDER BY created_at DESC`
   );
   return rows;
};

const getServiceById = async (id) => {
   const { rows } = await db.query(
      'SELECT * FROM services WHERE id = $1 AND is_active = TRUE',
      [id]
   );
   return rows[0] || null;
};

const createService = async ({ service_name, description, price, duration_minutes }) => {
   const { rows } = await db.query(
      `INSERT INTO services (service_name, description, price, duration_minutes)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [service_name, description, price, duration_minutes]
   );
   return rows[0].id;
};

const updateService = async (id, { service_name, description, price, duration_minutes }) => {
   await db.query(
      `UPDATE services
       SET service_name = $1, description = $2, price = $3, duration_minutes = $4
       WHERE id = $5 AND is_active = TRUE`,
      [service_name, description, price, duration_minutes, id]
   );
};

const deleteService = async (id) => {
   await db.query(
      'UPDATE services SET is_active = FALSE WHERE id = $1',
      [id]
   );
};

export {
   getAllServices,
   getServiceById,
   createService,
   updateService,
   deleteService
};

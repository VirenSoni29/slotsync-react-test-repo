import db from '../config/db.js';

const findByEmail = async (email) => {
   const { rows } = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
   );
   return rows[0] || null;
};

const findById = async (id) => {
   const { rows } = await db.query(
      'SELECT id, name, email, phone, role, is_verified, created_at FROM users WHERE id = $1',
      [id]
   );
   return rows[0] || null;
};

const createUser = async ({ name, email, phone, password }) => {
   const { rows } = await db.query(
      `INSERT INTO users (name, email, phone, password, role, is_verified)
         VALUES ($1, $2, $3, $4, 'customer', FALSE) RETURNING id`,
      [name, email, phone, password]
   );
   console.log(rows);
   return rows[0].id;  // returns the new user's ID
};

const createAdmin = async ({ name, email, phone, password }) => {
   const { rows } = await db.query(
      `INSERT INTO users (name, email, phone, password, role, is_verified)
         VALUES ($1, $2, $3, $4, 'admin', FALSE) RETURNING id`,
      [name, email, phone, password]
   );
   return rows[0].id;  // returns the new user's ID
};

const verifyUser = async (email) => {
   await db.query(
      'UPDATE users SET is_verified = TRUE WHERE email = $1',
      [email]
   );
};

const updatePassword = async (email, hashedPassword) => {
   await db.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, email]
   );
};

const updateProfile = async (id, { name, phone }) => {
   await db.query(
      'UPDATE users SET name = $1, phone = $2 WHERE id = $3',
      [name, phone, id]
   );
};

const findByIdWithPassword = async (id) => {
   const { rows } = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
   );
   return rows[0] || null;
};

export {
   findByEmail,
   findById,
   createUser,
   createAdmin,
   verifyUser,
   updatePassword,
   updateProfile,
   findByIdWithPassword
};

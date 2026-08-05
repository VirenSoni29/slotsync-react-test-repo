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

const updateRole = async (id, role) => {
   await db.query(
      'UPDATE users SET role = $1::user_role WHERE id = $2',
      [role, id]
   );
};

const getAllUsers = async () => {
   const { rows } = await db.query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.is_verified, u.created_at,
              b.id AS business_id, b.name AS business_name
       FROM users u
       LEFT JOIN business_profile b ON u.id = b.owner_id
       ORDER BY u.created_at DESC`
   );
   return rows;
};

const getUsers = async ({ search = '', status = 'all', role = 'all', sort = 'id-greatest', page = 1, limit = 10 } = {}) => {
   const conditions = [];
   const values = [];
   let paramIdx = 1;

   const allowedSorts = {
      'id-greatest': 'u.id DESC',
      'id-least': 'u.id ASC',
      'created-newest': 'u.created_at DESC',
      'created-oldest': 'u.created_at ASC',
      'az': 'u.name ASC',
      'za': 'u.name DESC'
   };

   if (status !== 'all') {
      if (status === 'verified') {
         conditions.push(`u.is_verified = TRUE`);
      } else if (status === 'unverified') {
         conditions.push(`u.is_verified = FALSE`);
      }
   }

   if (role !== 'all') {
      conditions.push(`u.role = $${paramIdx}::user_role`);
      values.push(role);
      paramIdx++;
   }

   const trimmedSearch = (search || '').trim();
   if (trimmedSearch !== '') {
      conditions.push(`(u.name ILIKE $${paramIdx} OR u.email ILIKE $${paramIdx} OR u.phone ILIKE $${paramIdx} OR b.name ILIKE $${paramIdx})`);
      values.push(`%${trimmedSearch}%`);
      paramIdx++;
   }

   const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
   const orderByClause = allowedSorts[sort] ? `ORDER BY ${allowedSorts[sort]}` : 'ORDER BY u.id DESC';

   const pageNum = Math.max(parseInt(page) || 1, 1);
   const lim = Math.max(parseInt(limit) || 10, 1);
   const offset = (pageNum - 1) * lim;

   const dataQuery = `
      SELECT u.id, u.name, u.email, u.phone, u.role, u.is_verified, u.created_at,
             b.id AS business_id, b.name AS business_name
      FROM users u
      LEFT JOIN business_profile b ON u.id = b.owner_id
      ${whereClause}
      ${orderByClause}
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
   `;

   const countQuery = `
      SELECT COUNT(*)::INT AS total_users
      FROM users u
      LEFT JOIN business_profile b ON u.id = b.owner_id
      ${whereClause}
   `;

   const { rows } = await db.query(dataQuery, [...values, lim, offset]);
   const { rows: countRows } = await db.query(countQuery, values);

   const totalUsers = countRows[0]?.total_users || 0;
   const totalPages = Math.max(Math.ceil(totalUsers / lim), 1);

   return {
      users: rows,
      pagination: {
         totalUsers,
         currentPage: pageNum,
         usersPerPage: lim,
         totalPages
      }
   };
};

const getUserWithBusiness = async (id) => {
   const { rows } = await db.query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.is_verified, u.created_at,
              b.id AS business_id, b.name AS business_name, b.slug AS business_slug
       FROM users u
       LEFT JOIN business_profile b ON u.id = b.owner_id
       WHERE u.id = $1`,
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
   updateRole,
   getAllUsers,
   getUsers,
   getUserWithBusiness
};


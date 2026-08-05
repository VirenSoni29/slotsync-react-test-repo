import db from '../config/db.js';

// Get single profile (for backward compatibility if owner_id not passed, or first active)
const getProfile = async () => {
   const { rows } = await db.query(
      'SELECT * FROM business_profile WHERE is_approved = TRUE ORDER BY id ASC LIMIT 1'
   );
   return rows[0] || null;
};

// Get business by owner_id (user ID)
const getBusinessByOwnerId = async (ownerId) => {
   const { rows } = await db.query(
      'SELECT * FROM business_profile WHERE owner_id = $1',
      [ownerId]
   );
   return rows[0] || null;
};

// Get business by ID
const getBusinessById = async (id) => {
   const { rows } = await db.query(
      'SELECT * FROM business_profile WHERE id = $1',
      [id]
   );
   return rows[0] || null;
};

// Get business by Slug
const getBusinessBySlug = async (slug) => {
   const { rows } = await db.query(
      'SELECT * FROM business_profile WHERE slug = $1 AND is_approved = TRUE',
      [slug]
   );
   return rows[0] || null;
};

// Get all approved businesses (for customer browsing & search)
const getAllBusinesses = async () => {
   const { rows } = await db.query(
      `SELECT b.*, u.name AS owner_name, u.email AS owner_email
       FROM business_profile b
       JOIN users u ON b.owner_id = u.id
       WHERE b.is_approved = TRUE
       ORDER BY b.created_at DESC`
   );
   return rows;
};

// Get all businesses (for platform admin)
const getAllBusinessesAdmin = async () => {
   const { rows } = await db.query(
      `SELECT b.*, u.name AS owner_name, u.email AS owner_email
       FROM business_profile b
       LEFT JOIN users u ON b.owner_id = u.id
       ORDER BY b.created_at DESC`
   );
   return rows;
};

// Create a new business entry (linked to owner_id)
const createBusiness = async ({ owner_id, name, tagline, email, phone, address, category, website, slug }) => {
   const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
   
   const { rows } = await db.query(
      `INSERT INTO business_profile
          (owner_id, name, tagline, email, phone, address, category, website, slug)
       VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
         owner_id,
         name,
         tagline || null,
         email || null,
         phone || null,
         address || null,
         category || null,
         website || null,
         generatedSlug
      ]
   );
   return rows[0];
};

// Update an existing business profile by owner_id or id
const updateBusiness = async (id, { name, tagline, email, phone, address, category, website, slug }) => {
   const { rows } = await db.query(
      `UPDATE business_profile SET
          name     = COALESCE($1, name),
          tagline  = COALESCE($2, tagline),
          email    = COALESCE($3, email),
          phone    = COALESCE($4, phone),
          address  = COALESCE($5, address),
          category = COALESCE($6, category),
          website  = COALESCE($7, website),
          slug     = COALESCE($8, slug),
          updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, tagline, email, phone, address, category, website, slug, id]
   );
   return rows[0];
};

// Legacy upsert profile compatibility helper
const upsertProfile = async (data) => {
   if (data.owner_id) {
      const existing = await getBusinessByOwnerId(data.owner_id);
      if (existing) {
         return await updateBusiness(existing.id, data);
      } else {
         return await createBusiness(data);
      }
   }
   return await getProfile();
};

export {
   getProfile,
   getBusinessByOwnerId,
   getBusinessById,
   getBusinessBySlug,
   getAllBusinesses,
   getAllBusinessesAdmin,
   createBusiness,
   updateBusiness,
   upsertProfile
};
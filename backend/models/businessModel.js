import db from '../config/db.js';

// ============================================================
//  businessModel.js
//  Single-business profile — always at most one row in the
//  business_profile table (PostgreSQL).
//
//  getProfile   → used by admin dashboard, and optionally by
//                 the public landing page to show business info
//  upsertProfile → INSERT the first time, UPDATE every time after
// ============================================================

// ── GET the business profile (returns null if not set up yet) ──
const getProfile = async () => {
   const { rows } = await db.query(
      'SELECT * FROM business_profile LIMIT 1'
   );
   return rows[0] || null;
};

// ── INSERT first time, UPDATE on every subsequent call ──
//    Works because there is always only one row (id = 1).
//    Using ON CONFLICT (id) DO UPDATE keeps the query idempotent.
const upsertProfile = async ({ name, tagline, email, phone, address, category, website }) => {
   const { rows } = await db.query(
      `INSERT INTO business_profile
          (id, name, tagline, email, phone, address, category, website)
       VALUES
          (1, $1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
          name     = EXCLUDED.name,
          tagline  = EXCLUDED.tagline,
          email    = EXCLUDED.email,
          phone    = EXCLUDED.phone,
          address  = EXCLUDED.address,
          category = EXCLUDED.category,
          website  = EXCLUDED.website
       RETURNING *`,
      [
         name,
         tagline ?? null,
         email ?? null,
         phone ?? null,
         address ?? null,
         category ?? null,
         website ?? null
      ]
   );

   return rows[0];
};

export { getProfile, upsertProfile };
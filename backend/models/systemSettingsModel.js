import db from '../config/db.js';

const getSetting = async (key) => {
   const { rows } = await db.query(
      'SELECT setting_value FROM system_settings WHERE setting_key = $1',
      [key]
   );
   return rows[0] ? rows[0].setting_value : null;
};

const setSetting = async (key, value) => {
   const { rows } = await db.query(
      `INSERT INTO system_settings (setting_key, setting_value)
       VALUES ($1, $2)
       ON CONFLICT (setting_key) DO UPDATE SET
          setting_value = EXCLUDED.setting_value,
          updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [key, value]
   );
   return rows[0];
};

export {
   getSetting,
   setSetting
};

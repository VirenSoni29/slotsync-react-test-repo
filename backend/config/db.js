import { Pool } from 'pg';
import config from './config.js';

const pool = new Pool({
   connectionString: config.DATABASE_URL,
   ssl: config.NODE_ENV === 'production'
      ? { rejectUnauthorized: true }
      : { rejectUnauthorized: false }, // Enables SSL for Neon connection
});

pool.on('connect', () => {
   console.log('Connected to Neon PostgreSQL database');
});

pool.on('error', (err) => {
   console.error('Unexpected error on idle PostgreSQL client', err);
});

export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();

const db = {
   query,
   getClient,
};

export default db;

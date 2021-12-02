/* eslint-disable no-console */
import connection from '../database/database.js';

const insertRecommendation = async ({ name, link }) => {
  const result = await connection.query(
    'INSERT INTO "songs" (name, link, score) VALUES ($1, $2, $3)',
    [name, link, 1],
  );
  return result;
};

const selectRecommendation = async ({ name }) => {
  const result = await connection.query(
    'SELECT * FROM "songs" WHERE name ILIKE $1',
    [name],
  );
  return result.rows[0];
};

export {
  insertRecommendation,
  selectRecommendation,
};

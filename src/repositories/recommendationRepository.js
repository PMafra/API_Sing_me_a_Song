/* eslint-disable no-console */
import connection from '../database/database.js';

const insertRecommendation = async ({ name, link }) => {
  const result = await connection.query(
    'INSERT INTO "songs" (name, link, score) VALUES ($1, $2, $3);',
    [name, link, 1],
  );
  return result;
};

const selectRecommendation = async ({ name }) => {
  const result = await connection.query(
    'SELECT * FROM "songs" WHERE name ILIKE $1;',
    [name],
  );
  return result.rows[0];
};

const updateScore = async ({ id, type }) => {
  let upOrdown;
  if (type === 'upvote') {
    upOrdown = '+';
  }
  if (type === 'downvote') {
    upOrdown = '-';
  }
  const result = await connection.query(
    `UPDATE "songs" SET score = score ${upOrdown} 1 WHERE id = $1 RETURNING songs.score;`,
    [id],
  );

  return result.rows[0];
};

const deleteRecommendation = async ({ id }) => {
  const result = await connection.query(
    'DELETE FROM "songs" WHERE id = $1;',
    [id],
  );
  return result;
};

const selectAll = async () => {
  const result = await connection.query(
    'SELECT * FROM "songs";',
  );
  return result.rows;
};

const selectRandom = async ({ filter }) => {
  let filterQuery = '';

  if (filter === 70) {
    filterQuery = 'score > 10';
  }
  if (filter === 30) {
    filterQuery = 'score BETWEEN 5 AND 10';
  }

  const result = await connection.query(
    `SELECT * FROM "songs" WHERE ${filterQuery};`,
  );

  return result.rows;
};

export {
  insertRecommendation,
  selectRecommendation,
  updateScore,
  deleteRecommendation,
  selectAll,
  selectRandom,
};

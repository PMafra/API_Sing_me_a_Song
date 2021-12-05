import connection from '../database/database.js';
import filterHelper from '../helpers/repositoryHelpers/filterHelper.js';

const selectQuery = async ({ name, amount, randomness }) => {
  const baseQuery = 'SELECT * FROM "songs"';
  const {
    finalQuery,
    preparedValue,
  } = filterHelper({
    baseQuery, name, amount, randomness,
  });

  const result = await connection.query(`${finalQuery};`, preparedValue);

  if (name || randomness) {
    return result.rows[0];
  }
  return result.rows;
};

const insertRecommendation = async ({ name, youtubeLink }) => {
  const result = await connection.query(
    'INSERT INTO "songs" (name, "youtubeLink", score) VALUES ($1, $2, $3);',
    [name, youtubeLink, 1],
  );
  return result;
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

export {
  insertRecommendation,
  updateScore,
  deleteRecommendation,
  selectQuery,
};

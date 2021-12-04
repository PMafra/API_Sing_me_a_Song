import connection from '../database/database.js';

const selectQuery = async ({ name, amount, filter }) => {
  let baseSelectQuery = 'SELECT * FROM "songs"';
  const preparedValue = [];

  if (name) {
    baseSelectQuery += ' WHERE name ILIKE $1;';
    preparedValue.push(name);
  }
  if (amount) {
    baseSelectQuery += ' ORDER BY score DESC LIMIT $1;';
    preparedValue.push(amount);
  }
  if (filter) {
    if (filter === 70) {
      baseSelectQuery += ' WHERE score > 10';
    }
    if (filter === 30) {
      baseSelectQuery += ' WHERE score BETWEEN -5 AND 10';
    }
    baseSelectQuery += ' ORDER BY random() DESC LIMIT 1;';
  }

  const result = await connection.query(`${baseSelectQuery};`, preparedValue);

  if (name || filter) {
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

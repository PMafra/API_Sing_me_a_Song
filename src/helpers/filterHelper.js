/* eslint-disable no-console */
const filterHelper = async ({
  baseQuery, name, amount, filter,
}) => {
  let finalQuery = baseQuery;
  const preparedValue = [];

  if (name) {
    finalQuery += ' WHERE name ILIKE $1';
    preparedValue.push(name);
  }
  if (amount) {
    finalQuery += ' ORDER BY score DESC LIMIT $1';
    preparedValue.push(amount);
  }
  if (filter) {
    if (filter === 70) {
      finalQuery += ' WHERE score > 10';
    }
    if (filter === 30) {
      finalQuery += ' WHERE score BETWEEN -5 AND 10';
    }
    finalQuery += ' ORDER BY random() DESC LIMIT 1';
  }
  console.log(filter);

  return {
    finalQuery,
    preparedValue,
  };
};

export default filterHelper;

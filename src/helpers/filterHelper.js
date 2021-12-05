const filterHelper = ({
  baseQuery, name, amount, randomness,
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
  if (randomness) {
    if (randomness === 70) {
      finalQuery += ' WHERE score > 10';
    }
    if (randomness === 30) {
      finalQuery += ' WHERE score BETWEEN -5 AND 10';
    }
    finalQuery += ' ORDER BY random() DESC LIMIT 1';
  }

  return {
    finalQuery,
    preparedValue,
  };
};

export default filterHelper;

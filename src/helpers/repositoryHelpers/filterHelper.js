const filterHelper = ({
  baseQuery, name, amount, randomness,
}) => {
  let finalQuery = baseQuery;
  const preparedValue = [];

  if (name) {
    preparedValue.push(name);
    finalQuery += ` WHERE name ILIKE $${preparedValue.length}`;
  }
  if (amount) {
    preparedValue.push(amount);
    finalQuery += ` ORDER BY score DESC LIMIT $${preparedValue.length}`;
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

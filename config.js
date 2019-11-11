module.exports = {
  development: {
    port: process.env.PORT || 3000,
    DBHost: process.env.DB_LOCAL_CONN_URL,
    cloudinary: process.env.CLOUDINARY_URL,
    saltingRounds: 10,
  },
  test: {
    port: process.env.PORT || 8082,
    DBHost: process.env.DB_TEST_CONN_URL,
    saltingRounds: 10,
  },
};

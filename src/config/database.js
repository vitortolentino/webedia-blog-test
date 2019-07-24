require('../bootstrap');
const { DB_USERNAME, DB_PASS, DB_NAME, DB_DIALECT, DB_HOST } = process.env;

module.exports = {
  dialect: DB_DIALECT || 'postgres',
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASS,
  database: DB_NAME,
  storage: './__tests__/database.sqlite',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

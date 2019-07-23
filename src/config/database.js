require('dotenv-safe/config');
const { DB_USERNAME, DB_PASS, DB_NAME } = process.env;

module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: DB_USERNAME,
  password: DB_PASS,
  database: DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

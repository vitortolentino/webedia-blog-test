import database from '../../src/database';

(async () => await database.connection.query('PRAGMA foreign_keys = OFF'))();

export default async function truncate() {
  return await Promise.all(
    Object.keys(database.connection.models).map(key => {
      if (['sequelize', 'Sequelize'].includes(key)) return null;
      return database.connection.models[key].destroy({
        force: true,
        truncate: true,
      });
    })
  );
}

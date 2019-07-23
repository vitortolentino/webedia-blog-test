import Sequelize from 'sequelize';

import { Author } from '../app/models';

import databaseConfig from '../config/database';

const models = [Author];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();

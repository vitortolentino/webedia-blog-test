import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Author extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async author => {
      const { password } = author;
      if (password) {
        author.password_hash = await bcrypt.hash(password.toString(), 8);
      }
    });

    return this;
  }
}

export default Author;

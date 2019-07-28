import Sequelize, { Model } from 'sequelize';

class Article extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        subtitle: Sequelize.STRING,
        content: Sequelize.TEXT,
        permalink: Sequelize.STRING,
      },
      { sequelize }
    );

    this.addHook('afterCreate', async article => {
      const { APPLICATION_URL } = process.env;
      const { id } = article;
      article.permalink = `${APPLICATION_URL}/article/${id}`;
      article.save();
    });

    return this;
  }

  static associate({ Author }) {
    this.belongsTo(Author, { foreignKey: 'author_id', as: 'author' });
  }
}

export default Article;

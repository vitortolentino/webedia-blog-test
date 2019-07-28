module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('articles', 'author_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'authors',
        key: 'id',
        allowNull: true,
      },
    });
  },

  down: queryInterface => queryInterface.removeColumn('articles', 'author_id'),
};

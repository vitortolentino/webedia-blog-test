module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('authors', 'status', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('authors', 'status');
  },
};

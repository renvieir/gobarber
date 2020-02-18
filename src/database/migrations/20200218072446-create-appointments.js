module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      user_id: {
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        references: { model: 'users', id: 'id' },
        type: Sequelize.INTEGER,
      },
      provider_id: {
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        references: { model: 'users', id: 'id' },
        type: Sequelize.INTEGER,
      },
      canceled_at: {
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('appointments');
  },
};

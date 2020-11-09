'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tags',
      'postId', {
        type: Sequelize.INTEGER
      }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tags')
  }
}

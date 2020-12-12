'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Comments.belongsTo(models.Users, {
        foreignKey: 'readerId',
        as: 'readerComment'
      })
      Comments.belongsTo(models.Users, {
        foreignKey: 'authorId',
        as: 'authorComment'
      })
      Comments.belongsTo(models.News, {
        foreignKey: 'postId'
      })
    }
  };
  Comments.init({
    postId: DataTypes.INTEGER,
    readerId: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    authorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comments'
  })
  return Comments
}

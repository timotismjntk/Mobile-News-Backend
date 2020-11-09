'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      News.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'Authors'
      })
      News.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'Category'
      })
      News.hasOne(models.Tags, {
        foreignKey: 'postId'
      })
    }
  };
  News.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    newsimage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'News'
  })
  return News
}

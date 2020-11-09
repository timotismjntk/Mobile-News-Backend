'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // Post.belongsTo(models.User)
      // Post.hasMany(models.Tags, {
      //   foreignKey: {
      //     name: 'postId'
      //   }
      // })
      // Post.hasOne(models.Category, {
      //   foreignKey: {
      //     name: 'categoryId'
      //     // allowNull: false
      //   }
      // })
      // Post.hasMany(models.NewsImage, {
      //   foreignKey: {
      //     name: 'postId',
      //     // allowNull: false
      //   }
      // })
    }
  };
  Post.init({
    title: DataTypes.STRING,
    Content: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post'
  })
  return Post
}

'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Users.hasMany(models.News, {
        foreignKey: 'userId'
      })
      Users.hasMany(models.Comments, {
        foreignKey: 'readerId'
      })
    }
  };
  Users.init({
    fullname: {
      type: DataTypes.STRING
      // validate: {
      //   isAlpha: {
      //     msg: 'name cannot contains number'
      //   }
      // }
    },
    birthdate: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email'
        }
      }
    },
    password: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: {
          msg: 'Please enter a valid phone number'
        }
      }
    },
    gender: DataTypes.ENUM('Male', 'Female'),
    role_id: DataTypes.INTEGER,
    avatar: DataTypes.STRING
    // avatar: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     notNull: {
    //       msg: 'Image is not attach'
    //     }
    //   }
    // }
  }, {
    sequelize,
    modelName: 'Users'
  })
  return Users
}

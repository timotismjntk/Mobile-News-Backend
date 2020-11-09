'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // User.hasMany(models.Post)
    }
  };
  User.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        isAlpha: {
          msg: 'name cannot contains number'
        }
      }
    },
    birthdate: {
      type: DataTypes.STRING,
      validate: {
        isDate: true
      }
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
    phoneNumber: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: {
          msg: 'Please enter a valid phone number'
        }
      }
    },
    gender: {
      type: DataTypes.TEXT('tiny'),
      validate: {
        isIn: {
          args: [['M', 'F']],
          msg: 'Gender must be M or F'
        }
      }
    },
    role_id: DataTypes.BOOLEAN,
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Image is not attach'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User'
  })
  return User
}

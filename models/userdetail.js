'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDetail.belongsTo(models.User)
    }

    get age (){
      const today = new Date().getFullYear()
      const birth = this.dateOfBirth.getFullYear()
      return (today - birth)
    }
  }
  UserDetail.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'First Name is required' },
        notEmpty: { msg: 'First Name is required' },
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Last Name is required' },
        notEmpty: { msg: 'Last Name is required' },
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Address is required' },
        notEmpty: { msg: 'Address is required' },
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Phone Number is required' },
        notEmpty: { msg: 'Phone Number is required' },
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: 'DOB is required' },
        notEmpty: { msg: 'DOB Name is required' },
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
    accountId: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'UserDetail',
  });
  UserDetail.addHook('beforeCreate', (userdetail, options) => {
    userdetail.accountId = `${userdetail.phoneNumber}-${userdetail.dateOfBirth}-tokek`;
  });
  return UserDetail;
};
const { DataTypes } = require("sequelize");

module.exports = (sequelize,DataTypes) =>{
    const User = sequelize.define('User',{
        name:{
            type:DataTypes.STRING(60),
            allowNull:false,
            validate:{
                len:[20,60]
            }
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
            validate:{
                isEmail:true
            }
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        },
        address:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                len:[1,400]
            }
        },
        role:{
            type:DataTypes.ENUM('admin','user','store_owner'),
            defaultValue:'user'
        }
    });
    return User;
}
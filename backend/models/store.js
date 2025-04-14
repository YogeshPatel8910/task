const { DataTypes } = require("sequelize");

module.exports = (sequelize,DataTypes) =>{
    const Store = sequelize.define('Store',{
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
            validate:{
                isEmail:true
            }
        },
        address:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                len:[1,400]
            }
        },
        ownerId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'Users',
                key:'id'
            }
        },
        averageRating:{
            type:DataTypes.FLOAT,
            defaultValue:0
        }
    });
    return Store;
}
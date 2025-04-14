module.exports = (sequelize , DataTypes) => {
    const Rating = sequelize.define('Rating',{
        rating:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                min:1,
                max:5
            }
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'Users',
                key:'id'
            }
        },
        storeId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'Stores',
                key:'id'
            }
        }
    });

    Rating.afterSave(async (rating,options) =>{
        const {Store} = require('./index');
        const {sequelize} = rating;
        const result = await sequelize.query(
            `SELECT AVG(rating) as average FROM Ratings WHERE storeId = ?`,
            {
                replacements:[rating.storeId],
                type:sequelize.QueryTypes.SELECT
            }
        );
        if(result && result[0]){
            await Store.update(
                {averageRating:result[0].average},
                {where:{id:rating.storeId}}
            );
        }
    });

    Rating.afterDestroy(async(rating,options) =>{
        const {Store} = require('./index');
        const {sequelize} = rating;
        const result = await sequelize.query(
            `SELECT AVG(rating) as average FROM Ratings WHERE storeId = ?`,
            {
                replacements:[rating.storeId],
                type:sequelize.QueryTypes.SELECT
            }
        );
        if(result && result[0]){
            await Store.update(
                {averageRating:result[0].rating || 0},
                {where:{id:rating.storeId}}
            );
        }
    });
    return Rating;
}
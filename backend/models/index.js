const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || "task",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "{}yogesh@8910{}",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: 'mysql',
        logging: false
    }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Store = require('./store')(sequelize, Sequelize);
db.Rating = require('./rating')(sequelize, Sequelize);

db.User.hasMany(db.Rating, {foreignKey: 'userId'});
db.Rating.belongsTo(db.User, {foreignKey: 'userId'});
db.Store.hasMany(db.Rating, {foreignKey: 'storeId'});
db.Rating.belongsTo(db.Store, {foreignKey: 'storeId'});
db.User.hasOne(db.Store, {foreignKey: 'ownerId'});
db.Store.belongsTo(db.User, {foreignKey: 'ownerId', as: 'owner'});

module.exports = db;
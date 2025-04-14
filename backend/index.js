const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { authRoutes, userRoutes, storeRoutes } = require('./routes');


const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.get('/', (req, res) => res.send('Hello World!'))


async function initialize() {
    const {Sequelize} = require('sequelize');
    try{
        const tempSequelize = new Sequelize(
            '',
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host:process.env.DB_HOST,
                dialect:'mysql',
                logging:false
            }
        );
        const dbName = process.env.DB_NAME || 'task';
        await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
        await tempSequelize.close();
    
        const db = require('./models');
        await db.sequelize.sync();
        console.log("Database Connected");
        app.listen(PORT,() => {
            console.log(`Server Started on http://localhost:${PORT}`);
        })
    } catch (error) {
        console.error("ERROR : ",error);
    }
}

initialize();
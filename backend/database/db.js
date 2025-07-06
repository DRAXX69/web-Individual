const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("postgres", "postgres", "pintu", {	
  dialect: 'postgres',
  host: 'localhost',
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    await sequelize.sync({ force: false });
    console.log('Database synced');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('appdb', 'root', '1404', {
  host: 'localhost',
  dialect:'mysql',
  
  pool:{
      max:5,
      min:0,
      acquire:30000,
      idle:10000
  }
});

async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
   } catch (error) {
    console.error('Unable to connect to the database:', error);
   }
   return sequelize;
}

module.exports = {
    connect, sequelize
};
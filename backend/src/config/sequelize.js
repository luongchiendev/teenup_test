const Sequelize = require('sequelize');

const config = require('./database');

const { Op } = Sequelize;
const operatorsAliases = {
  $like: Op.like,
  $not: Op.not,
  $in: Op.in,
  $ne: Op.ne,
  $eq: Op.eq,
  $notIn: Op.notIn,
  $and: Op.and,
  $between: Op.between,
  $or: Op.or,
  $gte: Op.gte,
  $lte: Op.lte,
  $gt: Op.gt,
  $lt: Op.lt
};

let sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url);
} else {
  sequelize = new Sequelize(
    config.connection.database,
    config.connection.user,
    config.connection.password, {
      host: config.connection.host,
      dialect: config.client,
      port: config.connection.port,
      operatorsAliases,
      logging: false,
    //   retry: {
    //   max: 10 // Thử tối đa 10 lần
    // },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.'); // eslint-disable-line no-console
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err); // eslint-disable-line no-console
  });

module.exports = sequelize;

require('dotenv').config();

module.exports = {
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST || "lms_db",
    user: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "123456", 
    database: process.env.DB_NAME || "lmsdb",
    charset: 'utf8',
    socketPath: process.env.SOCKET_PATH,
    port: process.env.DB_PORT,
  },
  migrations: {
    tableName: 'migrations',
    directory: `${process.cwd()}/server/migrations`
  },
  debug: true
};

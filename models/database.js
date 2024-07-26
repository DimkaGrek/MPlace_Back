import { Sequelize } from 'sequelize';

// const sequelize = new Sequelize('postgres://db_user:db_password@localhost:5432/db_name');
console.log('DB_NAME: ', process.env.DB_NAME);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
    }
);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database', err);
    });

export default sequelize;

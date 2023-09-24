import { Sequelize } from "sequelize";

// take database
const db = new Sequelize('jwt_auth_app3308', 'root', 'root', {
    host: "localhost",
    dialect: "mysql",
    port: 3308
});

export default db;
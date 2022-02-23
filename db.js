import pg from "pg";
const {Pool} = pg;

let localPoolConfig = {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: '5432',
    database: 'avtaar_db'
};
  
const pool = new Pool(localPoolConfig);

export default pool;

import { Sequelize, type Options } from 'sequelize'

const config = ():Options => {
  const config1: Options = {
    dialect: 'mssql',
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialectOptions: {
      options: {
        trustedConnection: true,
        encrypt: true
      }
    },
    pool: {
      min: 0,
      max: 5,
      idle: 10000
    }
  }
  
  // ConnectionString Mode
  const config2: Options = {  
    dialect: 'mssql',
    dialectModulePath: 'msnodesqlv8/lib/sequelize',
    dialectOptions: {
      options: {
        connectionString: process.env.DB_CONNECTIONSTRING,
        trustedConnection: true,
        encrypt: true
      }
    },
    pool: {
      min: 0,
      max: 5,
      idle: 10000
    }
  }

  // console.log("@@@@@@@@@@@@")
  // console.log(config1)
  // console.log(config2)
  // console.log(process.env.DB_MODE === '1' ? config1 : config2)
  
  return process.env.DB_MODE === '1' ? config1 : config2;
}

const sequelize = new Sequelize(config());

export default sequelize;
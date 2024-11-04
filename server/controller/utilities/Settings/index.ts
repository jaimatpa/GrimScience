import { tblSettings} from '~/server/models';
import { Sequelize, Op } from 'sequelize';
import { H3Event } from 'h3';
import fs from 'fs';

const readEnvFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('.env', (err, data) => {
      if (err) {
        return reject(err);
      }

      const envVars = data.toString().split('\n').reduce((acc, line) => {
        const [key, value] = line.split('=');
        acc[key.trim()] = value.trim();
        return acc;
      }, {});

      resolve(envVars);
    });
  });
};


export const getDatabaseConfig = async () => {
  try {
    const envVars = await readEnvFile();
    const SQLData = {
      Provider: envVars.DB_HOST,
      Source: envVars.DB_DATABASE,
      Initial: envVars.DB_USER,
      ID:envVars.DB_PASSWORD
    };

    for (const [key, value] of Object.entries(SQLData)) {
      if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
      }
    }
// console.log(SQLData);
    return SQLData;

  } catch (error) {
    console.error("Error getting database configuration:", error.message);
    return null;
  }
};

// Usage example (you can call this function when needed)
getDatabaseConfig().then(config => {
  console.log('Database Configuration:', config);
}).catch(err => {
  console.error('Failed to get database configuration:', err);
});

     


export const getCompanyInfoId = async () => {
    try {
      const companyInfo = await tblSettings.findOne({
        where: { uniqueid: 1 }
      });
  
      if (!companyInfo) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Setting not found'
        });
      }
  
      return companyInfo
  
    } catch (error) {
      console.error('Error fetching setting:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching setting'
      });
    }
  };
  

export const insertSettingsData = async (body) => {
  // console.log("----------------------------", body)
  try {
    // Find the record with uniqueid: 1
    const companyInfo = await tblSettings.findOne({
      where: { uniqueid: 1 }
    });

    if (!companyInfo) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Setting not found'
      });
    }

    const updatedData = {
      creditStoreUserName: body.creditStoreUserName,
      creditStoreName: body.creditStoreName,
      creditCardPassword: body.creditCardPassword,
      laborrate: parseFloat(body.laborrate),
      serviceLaborRate: parseFloat(body.serviceLaborRate),
      travelrate: parseFloat(body.travelrate),
      onsiterate: parseFloat(body.onsiterate),
      profitRate: parseFloat(body.profitRate),
      upsellrate: parseFloat(body.upsellrate),
      panelColors: body.panelColors,
      formColors: body.formColors,
      labelPinPrintPath: body.labelPinPrintPath,
      invoicePinPrintPath: body.invoicePinPrintPath,
      updatePath: body.updatePath,
      URN: body.URN
    };
    await companyInfo.update(updatedData);
    return {
      statusCode: 200,
      statusMessage: 'Setting updated successfully',
      data: companyInfo
    };

  } catch (error) {
    console.error('Error updating setting:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating setting'
    });
  }
};

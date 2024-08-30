import { Op, Sequelize } from 'sequelize';
import { tblBP, tblJobs, tblSettings } from "~/server/models";
import  sequelize  from '../../utils/databse';  
import { QueryTypes } from 'sequelize';  

const applyFilters = (params) => {
  const filterParams = ['PRODUCTLINE', 'MODEL', 'DESCRIPTION', 'grossprofit'];
  const whereClause = {};

  filterParams.forEach(param => {
    if (params[param]) {
      whereClause[param] = {
        [Op.like]: `%${params[param]}%`
      };
    }
  });
  
  if (params.CODE === 'true') {
    whereClause['CODE']= {
      [Op.not]: 'Inactive'
    };
  }

  return whereClause;
};

const formatDateForSQLServer = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export const getProducts = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;
  const whereClause = applyFilters(filterParams);
  const list = await tblBP.findAll({
    attributes: ['UniqueID', 'MODEL', 'DESCRIPTION', 'grossprofit', 'PRODUCTLINE', "SELLINGPRICE", "CODE"],
    where: {
      ...whereClause,
      TODAY: {
        [Op.eq]: Sequelize.literal(`(
          SELECT MAX(TODAY) 
          FROM tblBP AS t2 
          WHERE t2.instanceID = tblBP.instanceID
        )`)
      }
    },
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    offset,
    limit
  });

  return list;
  
}

export const getNumberOfProducts = async (filterParams) => {
  const whereClause = applyFilters(filterParams);
  const numberOfProducts = await tblBP.count({
    where: whereClause,
    distinct: true,  
    col: 'instanceID' 
  });
  return numberOfProducts;
}

export const productExistByID = async (id) => {
  const tableDetail = await tblBP.findByPk(id);
  
  if (tableDetail)
    return true;
  else
    return false;
}

export const getProductDetail = async (id) => {
  const tableDetail = await tblBP.findByPk(id);
  tableDetail.dataValues.VariablePricing = tableDetail.dataValues.VariablePricing == "1" ? true : false;
  return tableDetail
}

export const getRevisions = async (id) => {
  const tableDetail = await tblBP.findByPk(id);
  const revisions = await tblBP.findAll({
    where: {
      instanceID: tableDetail.dataValues.instanceID
    }
  })
  revisions.forEach(revision => {
    revision.dataValues.VariablePricing = revision.dataValues.VariablePricing == "1" ? true : false;
  })
  return revisions
}

export const getJobHistory = async (id) => {
  const tableDetail = await tblBP.findByPk(id);
  
  const jobHistory = await tblJobs.findAll({
    where: {
      instanceID: tableDetail.dataValues.instanceID
    }
  })
  return jobHistory
}

export const createProduct = async (data,files) => {

  const today = new Date();
  const createReqData = {
    ...data,
    CODE: "Initial",
    TODAY: formatDateForSQLServer(today),
    instanceID: Date.now() + Math.floor(Math.random() * 1000)
  };
  const newProduct = await tblBP.create(createReqData);
  let SPECSHEET = null
  for ( const file of files ) {
    await storeFileLocally(
        file,
        newProduct.dataValues.UniqueID+'_'+file.name.split(".pdf")[0],
        '/ProductSpecFiles'
    )
    SPECSHEET = '/ProductSpecFiles/'+newProduct.dataValues.UniqueID+'_'+file.name
  }
  let updatedNewProduct = {
    SPECSHEET
  };
  const newUpdatedProduct = await tblBP.update(updatedNewProduct, {
    where: { UniqueID: newProduct.dataValues.UniqueID }
  });
  
  return newUpdatedProduct;
};

export const updateProduct = async (data,files) => {
  const today = new Date();
  let SPECSHEET = data.SPECSHEET
  for ( const file of files ) {
    await storeFileLocally(
        file,
        data.UniqueID+'_'+file.name.split(".pdf")[0],
        '/ProductSpecFiles'
    )
    SPECSHEET = '/ProductSpecFiles/'+data.UniqueID+'_'+file.name
  }
  let updatedReqData = {
    ...data,
    TODAY: formatDateForSQLServer(today),
    instanceID: data.instanceID,
    SPECSHEET: SPECSHEET
  };
  await tblBP.update(updatedReqData, {
    where: { UniqueID: data.UniqueID }
  });
  return data.UniqueID;
}

export const revisionProduct = async (data, files) => {
  data.UniqueID = null
  const tableDetail = await tblBP.findByPk(data.UniqueID);
  const today = new Date(); 

  let SPECSHEET = data.SPECSHEET
  for ( const file of files ) {
    await storeFileLocally(
        file,
        data.UniqueID+'_'+file.name.split(".pdf")[0],
        '/ProductSpecFiles'
    )
    SPECSHEET = '/ProductSpecFiles/'+data.UniqueID+'_'+file.name
  }
  let updatedReqData = {
    ...data,
    CODE: "Revision",
    TODAY: formatDateForSQLServer(today),
    instanceID: tableDetail.dataValues.instanceID,
    SPECSHEET: SPECSHEET
  };
  await tblBP.create(updatedReqData);
  return data.UniqueID;
}

export const deleteProduct = async (id) => {
  await tblBP.destroy({ where: { UniqueID: id } });
  return id;
}


export const inactiveProduct = async (id, reqData) => {
  reqData.UniqueID = null
  const tableDetail = await tblBP.findByPk(id);
  const today = new Date(); 
  let updatedReqData = {
    ...reqData,
    CODE: "Inactive",
    TODAY: formatDateForSQLServer(today),
    instanceID: tableDetail.dataValues.instanceID
  };

  await tblBP.create(updatedReqData);
  return id;
  
}

export const bulkInactiveProduct = async (data) => {
  const promises = data.map(async uniqueID => {
    const tableDetail = await tblBP.findByPk(uniqueID);
    tableDetail.dataValues.UniqueID = null;

    const today = new Date();
    let updatedReqData = {
      ...tableDetail.dataValues,
      CODE: "Inactive",
      TODAY: formatDateForSQLServer(today),
      instanceID: tableDetail.dataValues.instanceID,
    };

    await tblBP.create(updatedReqData);
  });

  // Wait for all promises to resolve
  await Promise.all(promises);

  return true;
};
let depth = 0;
  async function getLaborHours(lngInstanceID, includeTopLevelLabor = true) {
    depth += 1;
    let hrs = 0;

    // Check if built in house
    const rs1 = await sequelize.query(`
        SELECT TOP 1 builtinhouse 
          FROM tblBP 
          WHERE instanceID = :instanceID 
          ORDER BY uniqueID DESC

    `, {
        replacements: { instanceID: lngInstanceID },
        type: QueryTypes.SELECT
    });

    if (rs1[0].builtinhouse === 'False' || !rs1[0].builtinhouse) {
      if (includeTopLevelLabor) {
          const rs2 = await sequelize.query(`
              SELECT hours FROM tblPlan WHERE instanceID = :instanceID
          `, {
              replacements: { instanceID: lngInstanceID },
              type: QueryTypes.SELECT
          });

          rs2.forEach(row => {
              hrs += parseFloat(row.hours || 0);
          });
      }

      const rs3 = await sequelize.query(`
          SELECT 
              (SELECT TOP 1 instanceID 
              FROM tblBP 
              WHERE uniqueID = tblBPParts.partid 
              ORDER BY uniqueID DESC) as instanceID, 
              qty 
          FROM tblBPParts 
          INNER JOIN tblSteps ON tblSteps.uniqueID = tblBPParts.stepID 
          INNER JOIN tblPlan ON tblPlan.uniqueID = tblSteps.PLANID 
          WHERE 
              (SELECT COUNT(uniqueID) 
              FROM tblPlan 
              WHERE instanceID = 
                  (SELECT TOP 1 instanceID 
                  FROM tblBP 
                  WHERE uniqueID = tblBPParts.partid 
                  ORDER BY uniqueID DESC)) > 0 
              AND tblPlan.instanceID = :instanceID
      `, {
          replacements: { instanceID: lngInstanceID },
          type: QueryTypes.SELECT
      });

      for (const row of rs3) {
          hrs += (await getLaborHours(parseFloat(row.instanceID))) * parseFloat(row.qty);
      }
      depth -= 1;
      return hrs;
  } else {
      depth -= 1;
      return hrs;
  }
}

export const calculateCostsAndProfit = async (id) => {
  const tableDetail = await tblBP.findByPk(id);
  const instanceID = tableDetail.dataValues.instanceID;
  const sellingPrice = tableDetail.dataValues.SELLINGPRICE;
  const settings = await tblSettings.findOne(); 
  const laborRate = settings.dataValues.laborrate;
  const profitRate = settings.dataValues.profitRate;
  const table1 = await sequelize.query(`
      SELECT tblbp.uniqueID, tblbp.instanceid, tblbpparts.qty
      FROM tblbp 
      INNER JOIN tblBPParts ON tblbp.uniqueid = tblbpparts.partid 
      INNER JOIN tblsteps ON tblsteps.uniqueid = tblbpparts.stepid 
      INNER JOIN tblplan ON tblplan.uniqueid = tblsteps.planid 
      WHERE tblPlan.instanceid = :instanceID
      ORDER BY model
  `, {
      replacements: { instanceID: instanceID },
      type: QueryTypes.SELECT
  });

  const table2 = await sequelize.query(`
      SELECT 
          (SUM(CAST(hours AS DECIMAL(12,3))) * :laborRate) AS totalhours, 
          SUM(CAST(hours AS DECIMAL(12,3))) AS hours 
      FROM tblPlan 
      WHERE instanceid = :instanceID
  `, {
      replacements: { instanceID: instanceID, laborRate: laborRate },
      type: QueryTypes.SELECT
  });

  let materialCost = 0;
  let productLabor = parseFloat(table2[0].totalhours || 0);
  let productLabourHours = parseFloat(table2[0].hours || 0);

  for (const row of table1) {
      const table3 = await sequelize.query(`
          SELECT tblbp.uniqueID, tblbp.model, tblbp.description, tblbp.unit, tblbp.inventorycost, tblBP.multiple 
          FROM tblbp 
          WHERE uniqueid = (SELECT MAX(uniqueid) FROM tblbp WHERE instanceid = :instanceID)
      `, {
          replacements: { instanceID: row.instanceid },
          type: QueryTypes.SELECT
      });

      let inventoryCost = table3[0].inventorycost || 1;

      if (!inventoryCost) {
          inventoryCost = 1;
          await sequelize.query(`
              UPDATE tblbp SET inventorycost = 1 
              WHERE uniqueid = :uniqueID
          `, {
              replacements: { uniqueID: table3[0].uniqueID },
              type: QueryTypes.UPDATE
          });
      }

      materialCost += parseFloat(inventoryCost) * parseFloat(row.qty);
  }

  const subAssemblyLaborHours = await getLaborHours(instanceID, false);
  const subAssemblyLaborCost = subAssemblyLaborHours * laborRate;

  const tmpA = productLabor;
  const tmpB = subAssemblyLaborCost;

  const totalLaborCost = tmpA + tmpB;
  const totalHours = productLabourHours + subAssemblyLaborHours;
  const grossProfit = (sellingPrice - materialCost - totalLaborCost)
  const grossProfitPercent = (grossProfit / sellingPrice) * 100;

  await sequelize.query(`
      UPDATE tblbp SET grossprofit = :grossProfit WHERE uniqueid = :uniqueID
  `, {
      replacements: { grossProfit: grossProfitPercent, uniqueID: instanceID },
      type: QueryTypes.UPDATE
  });

  return {
    materialCost: parseFloat(materialCost.toFixed(2)),
    productLabor: parseFloat(productLabor.toFixed(2)),
    productLabourHours: parseFloat(productLabourHours.toFixed(2)),
    subAssemblyLaborCost: parseFloat(subAssemblyLaborCost.toFixed(2)),
    subAssemblyLaborHours: parseFloat(subAssemblyLaborHours.toFixed(2)),
    totalLaborCost: parseFloat(totalLaborCost.toFixed(2)),
    totalHours: parseFloat(totalHours.toFixed(2)),
    totalCost: parseFloat((materialCost + totalLaborCost).toFixed(2)),
    suggestedPrice: parseFloat(((materialCost + totalLaborCost) / (1 - profitRate)).toFixed(2)),
    grossProfitPercent: parseFloat(grossProfitPercent.toFixed(2)),
    grossProfit: parseFloat(grossProfit.toFixed(2))
  };
  
}


export const getProductPartList = async (id) => {
  // Fetch main table details
  const tableDetail = await tblBP.findByPk(id);
  const instanceID = tableDetail.dataValues.instanceID;
  const qty = 1;

  // Query to get total quantity
  const table1 = await sequelize.query(`
    SELECT tblbp.instanceid, SUM(tblbpparts.qty) * :qty AS totalQuantity
    FROM tblbp
    INNER JOIN tblBPParts ON tblbp.uniqueid = tblbpparts.partid
    INNER JOIN tblsteps ON tblsteps.uniqueid = tblbpparts.stepid
    INNER JOIN tblplan ON tblplan.uniqueid = tblsteps.planid
    WHERE tblPlan.instanceid IN (:instanceID)
    GROUP BY tblbp.instanceID
  `, {
    replacements: { instanceID: instanceID, qty: qty },
    type: QueryTypes.SELECT
  });

  // Calculate labor hours for each item
  const results = await Promise.all(table1.map(async row => {
    // Fetch details for each item
    const table2 = await sequelize.query(`
      SELECT tblbp.model, tblbp.description, tblbp.inventoryunit, tblbp.ordercost, 
             tblbp.multiple, tblBP.inventorycost, tblBP.instanceID, code 
      FROM tblbp 
      WHERE uniqueid IN (
        SELECT MAX(uniqueid) FROM tblbp WHERE instanceid = :instanceid
      )
    `, {
      replacements: { instanceid: row['instanceid'] },
      type: QueryTypes.SELECT
    });

    // Calculate labor hours
    const calculateLaborHours = async (instanceID) => {
      let hours = 0;
      let results = await sequelize.query(`
        SELECT builtinhouse FROM tblBP WHERE instanceID = :instanceID
      `, {
        replacements: { instanceID: instanceID },
        type: QueryTypes.SELECT
      });

      const builtinhouse = results[0].builtinhouse;

      if (builtinhouse === 'False') {
        // Add top-level labor hours
        results = await sequelize.query(`
          SELECT hours FROM tblPlan WHERE instanceID = :instanceID
        `, {
          replacements: { instanceID: instanceID },
          type: QueryTypes.SELECT
        });

        hours += results.reduce((acc, row) => acc + parseFloat(row.hours), 0);

        // Recursively calculate sub-assembly labor hours
        results = await sequelize.query(`
          SELECT (SELECT TOP 1 tblBP.instanceID 
                  FROM tblBP 
                  WHERE tblbp.UniqueID = tblBPParts.partid 
                  ORDER BY tblBP.uniqueID DESC) AS instanceID, 
                 qty
          FROM tblBPParts
          INNER JOIN tblSteps ON tblSteps.uniqueID = tblBPParts.stepID
          INNER JOIN tblPlan ON tblPlan.uniqueID = tblSteps.PlanID
          WHERE (SELECT COUNT(tblPlan.uniqueID) 
                 FROM tblPlan 
                 WHERE tblPlan.instanceID = (SELECT TOP 1 tblBP.instanceID 
                                              FROM tblBP 
                                              WHERE tblbp.UniqueID = tblBPParts.partid 
                                              ORDER BY tblBP.uniqueID DESC)) > 0
          AND tblplan.instanceID = :instanceID
        `, {
          replacements: { instanceID: instanceID },
          type: QueryTypes.SELECT
        });

        for (const row of results) {
          hours += (await calculateLaborHours(row.instanceID)) * row.qty;
        }
      }
      return hours;
    };

    const laborHours = await calculateLaborHours(row['instanceid']);
    table2[0]['quantity'] = row['totalQuantity'];
    table2[0]['totalCost'] = parseFloat((row['totalQuantity'] * table2[0]['inventorycost']).toFixed(2));
    table2[0]['laborHours'] = parseFloat(laborHours.toFixed(2));
    return table2[0];
  }));

  return results;
}



export const getProductLine = async () => {
  const result = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('PRODUCTLINE')), 'PRODUCTLINE']
    ],
    where: {
      [Op.and]: [
        { PRODUCTLINE: { [Op.ne]: null } },
        { PRODUCTLINE: { [Op.ne]: '' } }
      ]
    },
    order: [['PRODUCTLINE', 'ASC']],
    raw: true
  });

  const distinctProductLine = result.map((item: any) => item.PRODUCTLINE);
  return distinctProductLine;
}

export const getUnit = async () => {
  const result = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('UNIT')), 'UNIT']
    ],
    where: {
      [Op.and]: [
        { UNIT: { [Op.ne]: null } },
        { UNIT: { [Op.ne]: '' } }
      ]
    },
    order: [['UNIT', 'ASC']],
    raw: true
  });

  const distinctUnit = result.map((item: any) => item.UNIT);
  return distinctUnit;
}

export const getInventoryUnit = async () => {
  const result = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('InventoryUnit')), 'InventoryUnit']
    ],
    where: {
      [Op.and]: [
        { InventoryUnit: { [Op.ne]: null } },
        { InventoryUnit: { [Op.ne]: '' } }
      ]
    },
    order: [['InventoryUnit', 'ASC']],
    raw: true
  });

  const distinctInventoryUnit = result.map((item: any) => item.InventoryUnit);
  return distinctInventoryUnit;
}

export const getElectrical = async () => {
  const result = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('ELECTRICAL')), 'ELECTRICAL']
    ],
    where: {
      [Op.and]: [
        { ELECTRICAL: { [Op.ne]: null } },
        { ELECTRICAL: { [Op.ne]: '' } }
      ]
    },
    order: [['ELECTRICAL', 'ASC']],
    raw: true
  });

  const distinctElectrical = result.map((item: any) => item.ELECTRICAL);
  return distinctElectrical;
}

export const getWarrenty = async () => {
  const result = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('WARRENTY')), 'WARRENTY']
    ],
    where: {
      [Op.and]: [
        { WARRENTY: { [Op.ne]: null } },
        { WARRENTY: { [Op.ne]: '' } }
      ]
    },
    order: [['WARRENTY', 'ASC']],
    raw: true
  });

  const distinctWarrenty = result.map((item: any) => item.WARRENTY);
  return distinctWarrenty;
}

export const getAccountNumber = async () => {
  const result = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('AccountNumber')), 'AccountNumber']
    ],
    where: {
      [Op.and]: [
        { AccountNumber: { [Op.ne]: null } },
        { AccountNumber: { [Op.ne]: '' } }
      ]
    },
    order: [['AccountNumber', 'ASC']],
    raw: true
  });

  const distinctAccountNumber = result.map((item: any) => item.AccountNumber);
  return distinctAccountNumber;
}

export const getCryothermCategory = async () => {
  const result = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('CRYOTHERMCATEGORY')), 'CRYOTHERMCATEGORY']
    ],
    where: {
      [Op.and]: [
        { CRYOTHERMCATEGORY: { [Op.ne]: null } },
        { CRYOTHERMCATEGORY: { [Op.ne]: '' } }
      ]
    },
    order: [['CRYOTHERMCATEGORY', 'ASC']],
    raw: true
  });

  const distinctCryothermCategory = result.map((item: any) => item.CRYOTHERMCATEGORY);
  return distinctCryothermCategory;
}

export const getCryothermWalls = async () => {
  const result = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('CRYOTHERMWALLS')), 'CRYOTHERMWALLS']
    ],
    where: {
      [Op.and]: [
        { CRYOTHERMWALLS: { [Op.ne]: null } },
        { CRYOTHERMWALLS: { [Op.ne]: '' } }
      ]
    },
    order: [['CRYOTHERMWALLS', 'ASC']],
    raw: true
  });

  const distinctCryothermWalls = result.map((item: any) => item.CRYOTHERMWALLS);
  return distinctCryothermWalls;
}

export const getCryothermSections = async () => {
  const result = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('CRYOTHERMSECTIONS')), 'CRYOTHERMSECTIONS']
    ],
    where: {
      [Op.and]: [
        { CRYOTHERMSECTIONS: { [Op.ne]: null } },
        { CRYOTHERMSECTIONS: { [Op.ne]: '' } }
      ]
    },
    order: [['CRYOTHERMSECTIONS', 'ASC']],
    raw: true
  });

  const distinctCryothermSections = result.map((item: any) => item.CRYOTHERMSECTIONS);
  return distinctCryothermSections;
}

export const getCryothermWarmTankSwitchable = async () => {
  const result = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('CRYOTHERMWARMTANKSWITCHABLE')), 'CRYOTHERMWARMTANKSWITCHABLE']
    ],
    where: {
      [Op.and]: [
        { CRYOTHERMWARMTANKSWITCHABLE: { [Op.ne]: null } },
        { CRYOTHERMWARMTANKSWITCHABLE: { [Op.ne]: '' } }
      ]
    },
    order: [['CRYOTHERMWARMTANKSWITCHABLE', 'ASC']],
    raw: true
  });

  const distinctCryothermWarmTankSwitchable = result.map((item: any) => item.CRYOTHERMWARMTANKSWITCHABLE);
  return distinctCryothermWarmTankSwitchable;
}

export const getDuraLastCategory = async () => {
  const result = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('DURALASTCATEGORY')), 'DURALASTCATEGORY']
    ],
    where: {
      [Op.and]: [
        { DURALASTCATEGORY: { [Op.ne]: null } },
        { DURALASTCATEGORY: { [Op.ne]: '' } }
      ]
    },
    order: [['DURALASTCATEGORY', 'ASC']],
    raw: true
  });

  const distinctDuraLastCategory = result.map((item: any) => item.DURALASTCATEGORY);
  return distinctDuraLastCategory;
}

export const getDuraLastSubCategory = async () => {
  const result = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('DURALASTSUBCATEGORY')), 'DURALASTSUBCATEGORY']
    ],
    where: {
      [Op.and]: [
        { DURALASTSUBCATEGORY: { [Op.ne]: null } },
        { DURALASTSUBCATEGORY: { [Op.ne]: '' } }
      ]
    },
    order: [['DURALASTSUBCATEGORY', 'ASC']],
    raw: true
  });

  const distinctDuraLastSubCategory= result.map((item: any) => item.DURALASTSUBCATEGORY);
  return distinctDuraLastSubCategory;
}

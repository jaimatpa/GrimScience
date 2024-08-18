import { Op, Sequelize } from 'sequelize';
import { tblBP, tblJobs } from "~/server/models";

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
    attributes: ['UniqueID', 'MODEL', 'DESCRIPTION', 'grossprofit', 'PRODUCTLINE'],
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
  for ( const file of files ) {
      await storeFileLocally(
          file,         // the file object
          8,            // you can add a name for the file or length of Unique ID that will be automatically generated!
          '/userFiles'  // the folder the file will be stored in
      )
  }
  const today = new Date();
  const createReqData = {
    ...data,
    CODE: "Initial",
    TODAY: formatDateForSQLServer(today),
    instanceID: Date.now() + Math.floor(Math.random() * 1000)
  };
  const newProduct = await tblBP.create(createReqData);
  for ( const file of files ) {
    await storeFileLocally(
        file,         // the file object
        newProduct.dataValues.UniqueID+'_'+file.name,            // you can add a name for the file or length of Unique ID that will be automatically generated!
        '/ProductSpecFiles'  // the folder the file will be stored in
    )
  }
  
  return newProduct;
};

export const updateProduct = async (id, reqData) => {
  const today = new Date(); 
  let updatedReqData = {
      ...reqData,
      TODAY: formatDateForSQLServer(today),
      instanceID: reqData.instanceID
    };
  await tblBP.update(updatedReqData, {
    where: { UniqueID: id }
  });
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

export const revisionProduct = async (id, reqData) => {
  reqData.UniqueID = null
  const tableDetail = await tblBP.findByPk(id);
  const today = new Date(); 
  let updatedReqData = {
    ...reqData,
    CODE: "Revision",
    TODAY: formatDateForSQLServer(today),
    instanceID: tableDetail.dataValues.instanceID
  };
  await tblBP.create(updatedReqData);
  return id;
}

export const deleteProduct = async (id) => {
  await tblBP.destroy({ where: { UniqueID: id } });
  return id;
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

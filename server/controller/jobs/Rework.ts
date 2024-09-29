import { Sequelize, Op } from "sequelize";
import  sequelize  from '../../utils/databse';  
import { QueryTypes } from 'sequelize';



const applyFilters = (params) => {
  const filterParams = ['PARTTYPE', 'SUBCATEGORY', 'MODEL', 'DESCRIPTION', 'partflag'];
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

export const getReworkParts = (filterParams) => {
  
  const whereClause = applyFilters(filterParams);
  
  console.log(whereClause)

}


export const getReworkCategories = async () => {
  
  const result =  await sequelize.query(`
    select distinct parttype from tblBP where uniqueid in (select max(uniqueid) as uniqueid from tblBP group by instanceid) order by parttype
  `, {
    type: QueryTypes.SELECT
  });

  const category = result
        .map((item) => item['parttype'])
        .filter((category) => category !== null);
        
  console.log(category)
  return category;
}

export const getReworkSubCategories = async () => {
  
  const result =  await sequelize.query(`
    select distinct subcategory from tblBP where uniqueid in (select max(uniqueid) as uniqueid from tblBP group by instanceid)  order by subcategory
  `, {
    type: QueryTypes.SELECT
  });

  const subCategory = result
        .map((item) => item['subcategory'])
        .filter((subcategory) => subcategory !== null);
  console.log(subCategory)
  return subCategory;
}

export const getSelectedPartInfo = async (jobId, jobOperationId) => {
  console.log(jobId, jobOperationId)
  const result =  await sequelize.query(`
    Select Qty, tblBPID, model, Description, inventoryCost, inventoryUnit from tblOperationReworks join tblbp on tblOperationReworks.tblBPID = tblbp.uniqueID where JobID = :jobId and OperationID = :jobOperationId
  `, {
    replacements: { jobId, jobOperationId },
    type: QueryTypes.SELECT
  });

  const list = result.map(row => {
    return { 
      qty:row.Qty,
      MODEL: row.model,
      DESCRIPTION: row.Description,
      InventoryCost: row.inventoryCost,
      InventoryUnit: row.inventoryUnit,
      Amount: (row.inventoryCost * row.Qty).toFixed(2),
      UniqueID: row.tblBPID
    }
  })
  
  return list;
}
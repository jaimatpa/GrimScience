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

export const saveReworkParts = async (lngJobID, lngJobOperationID, parts) => {
  try {
    console.log(lngJobID, lngJobOperationID, parts)
    for (const item of parts) {
      // Query to check if an existing record exists in tblOperationReworks
      const existingRecord = await sequelize.query(`
        SELECT * 
        FROM tblOperationReworks 
        WHERE JobID = :lngJobID 
          AND OperationID = :lngJobOperationID 
          AND tblBPID = :tblBPID
      `, {
        replacements: { lngJobID, lngJobOperationID, tblBPID: item.UniqueID },
        type: QueryTypes.SELECT
      });

      if (existingRecord.length === 0) {
        // Insert new record if it doesn't exist
        await sequelize.query(`
          INSERT INTO tblOperationReworks (JobID, OperationID, tblBPID, Qty) 
          VALUES (:lngJobID, :lngJobOperationID, :tblBPID, :Qty)
        `, {
          replacements: {
            lngJobID,
            lngJobOperationID,
            tblBPID: item.UniqueID,
            Qty: item.qty
          },
          type: QueryTypes.INSERT
        });
      } else {
        // Update the existing record
        await sequelize.query(`
          UPDATE tblOperationReworks 
          SET Qty = :Qty 
          WHERE JobID = :lngJobID 
            AND OperationID = :lngJobOperationID 
            AND tblBPID = :tblBPID
        `, {
          replacements: {
            Qty: item.qty,
            lngJobID,
            lngJobOperationID,
            tblBPID: item.UniqueID
          },
          type: QueryTypes.UPDATE
        });
      }
    }

    return { message: "Rework parts saved successfully." };
  } catch (error) {
    console.error("Error saving rework parts:", error.message);
    throw new Error(error.message);
  }
};

export const removePart = async (lngJobID, lngJobOperationID, partId) => {
  console.log(lngJobID, lngJobOperationID, partId)
  try {
    if (!partId) {
      throw new Error('Please select a part')
    }

    // Delete from tblOperationReworks
    await sequelize.query(`
      DELETE FROM tblOperationReworks 
      WHERE jobId = :lngJobID 
        AND OperationID = :lngJobOperationID 
        AND tblBPID = :tblBPID
    `, {
      replacements: {
        lngJobID,
        lngJobOperationID,
        tblBPID: partId
      },
      type: QueryTypes.DELETE
    });

    const result =  await sequelize.query(`
      Select Qty, tblBPID, model, Description, inventoryCost, inventoryUnit from tblOperationReworks join tblbp on tblOperationReworks.tblBPID = tblbp.uniqueID where JobID = :lngJobID and OperationID = :lngJobOperationID
    `, {
      replacements: { lngJobID, lngJobOperationID },
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

  } catch (error) {
    console.error("Error in removeFromInvoice:", error.message);
    throw new Error(error.message);
  }
};

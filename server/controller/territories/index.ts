import { Op, Sequelize } from 'sequelize';
import { tblTerritories } from "~/server/models";
import  sequelize  from '../../utils/databse';  
import { QueryTypes } from 'sequelize';  

const applyFilters = (params) => {
  const filterParams = ['Name', 'SalesRep', 'ServiceTech'];
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

export const getTerritories = async (filterParams) => {

  const whereClause = applyFilters(filterParams);
  const list = await tblTerritories.findAll({
    attributes: ['TerritoryID','Name', 'SalesRep', 'ServiceTech'],
    where: {
      ...whereClause,
    },
  });

  const modList = list.map((territory) =>{
    return {
      TerritoryID: territory.TerritoryID,
      Name:territory.Name,
      SalesRep: territory.SalesRep.split(' ').slice(1).join(' '),
      ServiceTech: territory.ServiceTech.split(' ').slice(1).join(' '),
      formSalesRep:  territory.SalesRep,
      formServiceTech: territory.ServiceTech,
    }
  })

  return modList;
  
}

export const getNames = async () => {
  const result = await tblTerritories.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('Name')), 'Name']
    ],
    where: {
      [Op.and]: [
        { Name: { [Op.ne]: null } },
        { Name: { [Op.ne]: '' } }
      ]
    },
    order: [['Name', 'ASC']],
    raw: true
  });

  const distinctName = result.map((item: any) => item.Name);
  return distinctName;
}

export const getSalesRep = async () => {
  const result = await tblTerritories.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('SalesRep')), 'SalesRep']
    ],
    where: {
      [Op.and]: [
        { SalesRep: { [Op.ne]: null } },
        { SalesRep: { [Op.ne]: '' } }
      ]
    },
    order: [['SalesRep', 'ASC']],
    raw: true
  });

  const distinctSalesRep = result.map((item: any) => item.SalesRep);
  return distinctSalesRep;
}

export const getServiceTech = async () => {
  const result = await tblTerritories.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('ServiceTech')), 'ServiceTech']
    ],
    where: {
      [Op.and]: [
        { ServiceTech: { [Op.ne]: null } },
        { ServiceTech: { [Op.ne]: '' } }
      ]
    },
    order: [['ServiceTech', 'ASC']],
    raw: true
  });

  const distinctServiceTech = result.map((item: any) => item.ServiceTech);
  return distinctServiceTech;
}

export const getStates = async (territoryId) => {
  if (!territoryId) {
    territoryId = -1;
  }

  // Query for states linked to the specified territory
  const query1 = `
    SELECT * 
    FROM tblTerritoryStates
    JOIN tblState ON tblState.UniqueID = tblTerritoryStates.StateID
    JOIN tblTerritories ON tblTerritories.TerritoryID = tblTerritoryStates.TerritoryID
    WHERE tblTerritoryStates.TerritoryID = :territoryId
    ORDER BY tblState.State
  `;

  const statesInTerritory = await sequelize.query(query1, {
    replacements: { territoryId },
    type: QueryTypes.SELECT
  });

  const stateList = statesInTerritory.map(row => ({
    checked: true,
    stateName: row.state || '',
    territoryStateID: row.TerritoryStateID,
    stateID: row.StateID
  }));

  // Query for states not linked to the specified territory
  const query2 = `
    SELECT * 
    FROM tblState
    LEFT JOIN tblTerritoryStates ON tblTerritoryStates.StateID = tblState.UniqueID
    WHERE (tblTerritoryStates.TerritoryID IS NULL 
    OR tblTerritoryStates.TerritoryID = 0 
    OR NOT tblTerritoryStates.TerritoryID = :territoryId)
    ORDER BY tblState.State
  `;

  const statesNotInTerritory = await sequelize.query(query2, {
    replacements: { territoryId },
    type: QueryTypes.SELECT
  });

  statesNotInTerritory.forEach(row => {
    stateList.push({
      checked: false,
      stateName: row.state || '',
      territoryStateID: row.TerritoryStateID || null,
      stateID: row.StateID
    });
  });

  // Sorting the final list alphabetically by state name
  const sortedList = stateList.sort((a, b) => a.stateName.localeCompare(b.stateName));

  return sortedList;
}

export const addTerritory = async (name, salesRep, serviceTech, states) => {
  try {
    
    // Insert new territory record
    const newTerritory = await tblTerritories.create({
      Name: name,
      SalesRep: salesRep,
      ServiceTech: serviceTech
    });

    // Get the latest TerritoryID
    const maxIdQuery = `
      SELECT MAX(TerritoryID) AS maxID 
      FROM tblTerritories
    `;
    const maxIDResult = await sequelize.query(maxIdQuery, {
      type: QueryTypes.SELECT
    });

    const territoryId = maxIDResult[0].maxID;

    // Update the states associated with the territory
    for (let state of states) {
      const { checked, territoryStateID } = state;
      if (checked) {
        // If the state is checked, update with the new TerritoryID
        await sequelize.query(`
          UPDATE tblTerritoryStates 
          SET TerritoryID = :territoryId 
          WHERE TerritoryStateID = :territoryStateID
        `, {
          replacements: { territoryId, territoryStateID }
        });
      } else {
        // If the state is unchecked, remove the association (set TerritoryID to null)
        await sequelize.query(`
          UPDATE tblTerritoryStates 
          SET TerritoryID = null 
          WHERE TerritoryStateID = :territoryStateID 
          AND TerritoryID = :territoryId
        `, {
          replacements: { territoryId, territoryStateID }
        });
      }
    }


  } catch (error) {
    console.error('Error adding territory:', error);
    throw error;
  }
};

export const updateTerritory = async (territoryId, name, salesRep, serviceTech, states) => {
  try {
    // Fetch the territory record by TerritoryID
    const territory = await tblTerritories.findByPk(territoryId);

    // Update the territory details
    await territory.update({
      Name: name,
      SalesRep: salesRep,
      ServiceTech: serviceTech
    });

    // Update the states associated with the territory
    for (let state of states) {
      const { checked, territoryStateID } = state;
      if (checked) {
        // If the state is checked, set the TerritoryID
        await sequelize.query(`
          UPDATE tblTerritoryStates 
          SET TerritoryID = :territoryId 
          WHERE TerritoryStateID = :territoryStateID
        `, {
          replacements: { territoryId, territoryStateID }
        });
      } else {
        // If the state is unchecked, remove the association (set TerritoryID to null)
        await sequelize.query(`
          UPDATE tblTerritoryStates 
          SET TerritoryID = null 
          WHERE TerritoryStateID = :territoryStateID 
          AND TerritoryID = :territoryId
        `, {
          replacements: { territoryId, territoryStateID }
        });
      }
    }

  } catch (error) {
    console.error('Error updating territory:', error);
    throw error;
  }
};


export const territoryExistByID = async (id) =>{
  const tableDetail = await tblTerritories.findByPk(id);
  if (tableDetail)
    return true;
  else
    return false;
}

export const deleteTerritory = async (id) =>{
  await sequelize.query(`
    UPDATE tblTerritoryStates SET TerritoryID = null where TerritoryID = :territoryId
  `, {
    replacements: { territoryId: id }
  });
  await sequelize.query(`
    Delete from tblTerritories where TerritoryID = :territoryId
  `, {
    replacements: { territoryId: id }
  });
  return id
}




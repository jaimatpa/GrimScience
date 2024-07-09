import { Sequelize, Op } from "sequelize";
import {  vwServiceReportListing } from "~/server/models";

const applyFilters = (params) => {
    const filterParams = ['SO#','SO Status','SN#','SO Date', 'Cust #', 'Company', 'city','ST','SO Type', 'Failure Comment', 'SR#', 'Status', 'Type', 'Service Tech', 'SR Date', 'Week','Invoice','REPAIRSMADE']
    const whereClause = {};

    filterParams.forEach(param => {
        if (params[param]) {
            if (param === 'Type') {
                whereClause[param] = {
                    [Op.in]: Array.isArray(params[param]) ? params[param] : [params[param]]
                };
            } else if (param === 'SO Date' || param === 'SR Date') {
                const dateColumn = param === 'SO Date' ? 'SO Date' : 'SR Date';
                whereClause[dateColumn] = Sequelize.where(
                    Sequelize.fn('FORMAT', Sequelize.col(dateColumn), 'MM/dd/yyyy'),
                    {
                        [Op.like]: `%${params[param]}%`
                    }
                );
            } else {
                whereClause[param] = {
                    [Op.like]: `%${params[param]}%`
                };
            }
        }
    });

    return whereClause;
};

export const getScheduleList = async (page, pageSize, sortBy, sortOrder, filterParams) => {
    const limit = parseInt(pageSize as string, 10) || 10;
    const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;

    const whereClause = applyFilters(filterParams);

    const list = await vwServiceReportListing.findAll({
        attributes: ['uniqueID','SO#','SO Status','SN#','SO Date', 'Cust #', 'Company', 'city','ST','SO Type', 'Failure Comment', 'SR#', 'Status', 'Type', 'Service Tech', 'SR Date', 'Week','Invoice','REPAIRSMADE'],
        where: whereClause,
        order: [[sortBy as string || 'uniqueID', sortOrder as string || 'ASC']],
        offset,
        limit
    });

    const formattedList = list.map((item: any) => {
        let soDate = new Date(item['SO Date']).toISOString().split('T')
        soDate = soDate[0].split('-')
        let formattedSoDate = `${soDate[1]}/${soDate[2]}/${soDate[0]}`

        let srDate = new Date(item['SR Date']).toISOString().split('T')
        srDate = srDate[0].split('-')
        let formattedSrDate = `${srDate[1]}/${srDate[2]}/${srDate[0]}`

       // Return the formatted item, making sure to include all attributes
       return {
        uniqueID: item.uniqueID,
        'SO#': item['SO#'],
        'SO Status': item['SO Status'],
        'SN#': item['SN#'],
        'SO Date': formattedSoDate,  // Use formatted date
        'Cust #': item['Cust #'],
        'Company': item.Company,
        'city': item.city,
        'ST': item.ST,
        'SO Type': item['SO Type'],
        'Failure Comment': item['Failure Comment'],
        'SR#': item['SR#'],
        'Status': item.Status,
        'Type': item.Type,
        'Service Tech': item['Service Tech'],
        'SR Date': formattedSrDate,
        'Week': item.Week,
        'Invoice': item.Invoice,
        'REPAIRSMADE': item.REPAIRSMADE
    };
    })

    console.log('formattedList',formattedList);
    
    return formattedList;
}

export const getAllSchedules = async (sortBy, sortOrder, filterParams) => {
    const whereClause = applyFilters(filterParams);
  
    const list = await vwServiceReportListing.findAll({
      attributes: ['uniqueID','SO#','SO Status','SN#','SO Date', 'Cust #', 'Company', 'city','ST','SO Type', 'Failure Comment', 'SR#', 'Status', 'Type', 'Service Tech', 'SR Date', 'Week','Invoice','REPAIRSMADE'],
      where: whereClause,
      order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    });
    return list;
  }

export const getNumberOfSchedules = async (filterParams) => {
    const whereClause = applyFilters(filterParams);
    const numberOfCustomers = await vwServiceReportListing.count({
        where: whereClause
    });
    return numberOfCustomers;
}

export const ScheduleExistByID = async (id: number | string) => {
    const tableDetail = await vwServiceReportListing.findByPk(id);
    if(tableDetail)
      return true;
    else
      return false;
  }
  
  export const getScheduleDetail = async (id) => {
    const tableDetail = await vwServiceReportListing.findByPk(id);
    return tableDetail
  }

  export const getWeeks = async () => {
    const result = await vwServiceReportListing.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('Week')), 'Week']
      ],
      where: {
        [Op.and]: [
          { Week: { [Op.ne]: null } },
          { Week: { [Op.ne]: '' } }
        ]
      },
      order: [['Week', 'ASC']],
      raw: true
    });
  
    const distinctWeeks = result.map((item: any) => item.Week);
    return distinctWeeks;
  }

  export const getServiceTech = async () => {
    const result = await vwServiceReportListing.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('Service Tech')), 'Service Tech']
      ],
      where: {
        [Op.and]: [
          { 'Service Tech': { [Op.ne]: null } },
          { 'Service Tech': { [Op.ne]: '' } }
        ]
      },
      order: [['Service Tech', 'ASC']],
      raw: true
    });
  
    const distinctST = result.map((item: any) => item['Service Tech']);
    return distinctST;
  }

  export const getSOCategories = async () => {
    const result = await vwServiceReportListing.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('SO Type')), 'SO Type']
      ],
      where: {
        [Op.and]: [
          { 'SO Type': { [Op.ne]: null } },
          { 'SO Type': { [Op.ne]: '' } }
        ]
      },
      order: [['SO Type', 'ASC']],
      raw: true
    });
  
    const distinctSO = result.map((item: any) => item['SO Type']);
    return distinctSO;
  }



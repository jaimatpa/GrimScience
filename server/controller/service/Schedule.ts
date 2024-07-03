import { Sequelize, Op } from "sequelize";
import {  vwServiceReportListing } from "~/server/models";

const applyFilters = (params) => {
    const filterParams = ['SO#','SO Status','SN#','SO Date', 'Cust #', 'Company', 'city','ST','SO Type', 'Failure Comment', 'SR#', 'Status', 'Type', 'Service Tech', 'SR Date', 'Week','Invoice','REPAIRSMADE']
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
    return list;
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



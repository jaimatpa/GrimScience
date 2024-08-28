import { Sequelize, Op } from "sequelize";
import { tblOrganization } from "~/server/models";

const applyFilters = (params) => {
    const filterParams = ['UniqueID', 'ReportsTo', 'Title', 'Employee', 'JobDescription', 'WorkCenters', 'Skills', 'Talents']
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

export const getAllOrganization = async (page, pageSize, sortBy, sortOrder, filterParams) => {
    const limit = parseInt(pageSize as string, 10) || 10;
    const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;

    const whereClause = applyFilters(filterParams);

    const list = await tblOrganization.findAll({
        attributes: ['UniqueID', 'ReportsTo', 'Title', 'Employee', 'JobDescription', 'WorkCenters', 'Skills', 'Talents'],
        where: whereClause,
        order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
        offset,
        limit
    });
    return list;
}

export const getNumberOfOrganization = async (filterParams) => {
    const whereClause = applyFilters(filterParams);
    const numberOfCustomers = await tblOrganization.count({
        where: whereClause
    });
    return numberOfCustomers;
}

export const createOrganization = async (data) => {
    const createReqData = {
        ...data,
    };
    const newCustomer = await tblOrganization.create(createReqData);
    return newCustomer
}

export const OrganizationExistByID = async (id: number | string) => {
    const tableDetail = await tblOrganization.findByPk(id);
    if (tableDetail)
        return true;
    else
        return false;
}

export const getOrganizationDetail = async (id) => {
    const tableDetail = await tblOrganization.findByPk(id);
    return tableDetail
}

export const updateOrganization = async (id, reqData) => {
    await tblOrganization.update(reqData, {
        where: { UniqueID: id }
    });
    return id;
}

export const deleteOrganization = async (id) => {
    await tblOrganization.destroy({ where: { UniqueID: id } });
    return id;
}



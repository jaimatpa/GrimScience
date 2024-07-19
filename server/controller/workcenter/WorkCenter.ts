import { tblEmployee, tblWorkCenters } from "~/server/models";
import { Sequelize, Op } from "sequelize";

const applyFilters = (params) => {
    const filterParams = ['uniqueID', 'NAME', 'NUMBER', 'position', 'QB_Activity', 'TimeEntryWithoutJob', 'Paid'];
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

export const getAllWorkCenters = async (sortBy, sortOrder, filterParams) => {

    const whereClause = applyFilters(filterParams);

    const list = await tblWorkCenters.findAll({
        attributes: ['uniqueID', 'NAME', 'NUMBER', 'position', 'QB_Activity', 'TimeEntryWithoutJob', 'Paid'],
        where: whereClause,
        order: [[sortBy as string || 'NUMBER', sortOrder as string || 'ASC']],
    });

    return list;
}

export const getResponsibilites = async () => {
    const result = await tblWorkCenters.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('position')), 'position']
        ],
        where: {
            [Op.and]: [
                { 'position': { [Op.ne]: null } },
                { 'position': { [Op.ne]: '' } }
            ]
        },
        order: [['position', 'ASC']],
        raw: true
    });

    const distinctposition = result.map((item: any) => item['position']);
    return distinctposition;
}

export const WorkCenterExistById = async (id: number | string) => {
    const tableDetail = await tblWorkCenters.findByPk(id);
    if (tableDetail)
        return true;
    else
        return false;
}

export const updateWorkCenter = async (id, reqData) => {
    await tblWorkCenters.update(reqData, {
        where: { UniqueID: id }
    });
    return id;
}
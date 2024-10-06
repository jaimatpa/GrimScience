import { tblSiteVisit } from "~/server/models";
import { Op, Sequelize } from 'sequelize';



export const getSiteVisitByCustomerId = async (filterParams) => {
    let customerWhere = {}
    if (filterParams.CustomerID) customerWhere['CustomerID'] = { [Op.like]: `%${filterParams.CustomerID}%` };

    const list = await tblSiteVisit.findAll({
        attributes: ['VisitID', 'VisitDate', 'VisitNumber', 'Status', 'CustomerID'],
        where: customerWhere,
    });
    return list;
}
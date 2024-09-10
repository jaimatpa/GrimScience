import { Sequelize } from "sequelize";
import * as models from "../../models";
export const getCategoryList = async () => {
    try {
        const categoriesList = await models.tblBP.findAll({
            attributes: [
                [Sequelize.literal('DISTINCT PARTTYPE'), 'PARTTYPE']
            ],
            subQuery: false,
            order: [['PARTTYPE', 'ASC']],
            raw: true
        });
        return categoriesList;
    } catch (error) {
        throw new Error(`Error fetching data from table tblBP: ${error.message}`);
    }
};
export const getUnitList = async () => {
    try {
        const categoriesList = await models.tblBP.findAll({
            attributes: [
                [Sequelize.literal('DISTINCT unit'), 'unit']
            ],
            subQuery: false,
            order: [['unit', 'ASC']],
            raw: true
        });
        return categoriesList;
    } catch (error) {
        throw new Error(`Error fetching data from table tblBP: ${error.message}`);
    }
};
export const getSubCategoryList = async (PARTTYPE) => {
    try {
        const categoriesList = await models.tblBP.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('SUBCATEGORY')), 'SUBCATEGORY']
            ],
            where: {
                PARTTYPE,
                SUBCATEGORY: {
                    [Sequelize.Op.ne]: null,
                    [Sequelize.Op.ne]: ''
                }
            },
            order: [['SUBCATEGORY', 'ASC']],
            raw: true
        });
        return categoriesList;
    } catch (error) {
        throw new Error(`Error fetching subcategories for PARTTYPE ${PARTTYPE} from table tblBP: ${error.message}`);
    }
};
export const getRevisions = async (instanceId) => {
    try {
        const bpList = await models.tblBP.findAll({
            attributes: ['uniqueid', 'today', 'code', 'revisedby'],
            where: {
                instanceid: instanceId
            },
            order: [
                [Sequelize.literal('CAST(today AS DATETIME)'), 'DESC']
            ],
            raw: true
        });
        return bpList;
    } catch (error) {
        throw new Error(`Error fetching data for instanceId ${instanceId} from table tblBP: ${error.message}`);
    }
};

export const getInspectionNumberList = async (PARTTYPE, SUBCATEGORY) => {
    try {

        const inspectionNumbersList = await models.tblBP.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('InspectionLevel')), 'InspectionLevel']
            ],
            where: {
                PARTTYPE,
                SUBCATEGORY,
                // STOCKNUMBER: {
                //     [Sequelize.Op.ne]: null,
                //     [Sequelize.Op.ne]: ''
                // }
            },
            // order: [['STOCKNUMBER', 'ASC']],
            raw: true
        });
        return inspectionNumbersList;
    } catch (error) {
        throw new Error(`Error fetching inspection numbers for PARTTYPE ${PARTTYPE} and SUBCATEGORY ${SUBCATEGORY} from table tblBP: ${error.message}`);
    }
};
export const getAccountList = async () => {
    try {
        const accountList = await models.tblAccounts.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('AcctNumber')), 'AcctNumber'],
                'Description'
            ],
            order: [['AcctNumber', 'ASC']],
            raw: true
        });
        // Format the results into an array of strings
        const formattedList = accountList.map(account =>
            `#${account.AcctNumber}  ${account.Description}`
        );

        return formattedList;
    } catch (error) {
        throw new Error(`Error fetching data from table tblAccounts: ${error.message}`);
    }
};
export const getVendorStatus = async () => {
    try {
        const statusList = await models.tblVendors.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('ApprovalStatus')), 'ApprovalStatus'],
            ],
            order: [['ApprovalStatus', 'ASC']],
            raw: true
        });

        return statusList;
    } catch (error) {
        throw new Error(`Error fetching data from table tblAccounts: ${error.message}`);
    }
};

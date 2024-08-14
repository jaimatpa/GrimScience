import { tblSkills } from "~/server/models";
import { Sequelize, Op } from "sequelize";

const applyFilters = (params) => {
    const filterParams = ['UniqueID', 'Name', 'Catagory', 'subcatagory', 'weeks', 'frequency', 'date', 'by'];
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

export const getAllSkills = async (sortBy, sortOrder, filterParams) => {

    const whereClause = applyFilters(filterParams);

    const list = await tblSkills.findAll({
        attributes: ['UniqueID', 'Name', 'Catagory', 'subcatagory', 'weeks', 'frequency', 'date', 'by'],
        where: whereClause,
        order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    });

    return list;
}

export const getSkillsCatagory = async () => {
    const result = await tblSkills.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('Catagory')), 'Catagory']
        ],
        where: {
            [Op.and]: [
                { 'Catagory': { [Op.ne]: null } },
                { 'Catagory': { [Op.ne]: '' } }
            ]
        },
        order: [['Catagory', 'ASC']],
        raw: true
    });

    const distinctCatagory = result.map((item: any) => item['Catagory']);
    return distinctCatagory;
}

export const getSkillsFrequency = async () => {
    const result = await tblSkills.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('frequency')), 'frequency']
        ],
        where: {
            [Op.and]: [
                { 'frequency': { [Op.ne]: null } },
                { 'frequency': { [Op.ne]: '' } }
            ]
        },
        order: [['frequency', 'ASC']],
        raw: true
    });

    const distinctfrequency = result.map((item: any) => item['frequency']);
    return distinctfrequency;
}

export const getSkillsSubCatagory = async () => {
    const result = await tblSkills.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('subcatagory')), 'subcatagory']
        ],
        where: {
            [Op.and]: [
                { 'subcatagory': { [Op.ne]: null } },
                { 'subcatagory': { [Op.ne]: '' } }
            ]
        },
        order: [['subcatagory', 'ASC']],
        raw: true
    });

    const distinctsubcatagory = result.map((item: any) => item['subcatagory']);
    return distinctsubcatagory;
}

export const SkillExistById = async (id: number | string) => {
    const tableDetail = await tblSkills.findByPk(id);
    if (tableDetail)
        return true;
    else
        return false;
}

export const createNewSkill = async (data) => {
    const createReqData = {
        ...data,
    };
    const newCustomer = await tblSkills.create(createReqData);
    return newCustomer
}


export const getSkillDetail = async (id) => {
    const tableDetail = await tblSkills.findByPk(id);
    return tableDetail
}

export const updateSkill = async (id, reqData) => {
    await tblSkills.update(reqData, {
        where: { UniqueID: id }
    });
    return id;
}

export const deleteSkill = async (id) => {
    await tblSkills.destroy({ where: { UniqueID: id } });
    return id;
}
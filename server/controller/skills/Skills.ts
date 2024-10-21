import { tblSkills } from "~/server/models";
import { Sequelize,QueryTypes, Op } from "sequelize";
import  sequelize  from '../../utils/databse';  

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

export const getSkillCount = async (filterParams) => {
    const whereClause = applyFilters(filterParams);

    // Count the number of records matching the filters
    const count = await tblSkills.count({
        where: whereClause
    });

    return count;
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

export const getSkillReportData = async (skillId) => {
    // Step 1: Fetch the main skill data from tblSkills
    const skillData = await sequelize.query(`
      SELECT * FROM tblSkills WHERE UniqueID = :skillId
    `, {
      replacements: { skillId },
      type: QueryTypes.SELECT
    });
  
    if (skillData.length === 0) {
      return {}; // If no skill data found, return an empty object
    }
  
    const skill = skillData[0]; // Skill data from tblSkills
  
    // Step 2: Fetch associated work centers (stored as comma-separated IDs in WorkCenters)
    const workCenterIds = skill.WorkCenters ? skill.WorkCenters.split(',').map(id => id.trim()) : [];
    let workCenters = [];
  
    if (workCenterIds.length > 0) {
      workCenters = await sequelize.query(`
        SELECT Name FROM tblWorkcenters WHERE UniqueID IN (:workCenterIds)
      `, {
        replacements: { workCenterIds },
        type: QueryTypes.SELECT
      });
    }
  
    // Step 3: Fetch associated parts (stored as '=' separated IDs in Parts)
    const partIds = skill.Parts ? skill.Parts.split('=').map(id => id.trim()) : [];
    let parts = [];
  
    if (partIds.length > 0) {
      parts = await sequelize.query(`
        SELECT Description, Model FROM tblBP WHERE UniqueID IN (:partIds)
      `, {
        replacements: { partIds },
        type: QueryTypes.SELECT
      });
    }
  
    // Step 4: Organize all data into a single object
    const reportData = {
      skill:skill,
      workCenters: workCenters.map(center => center.Name), // List of work center names
      parts: parts.map(part => `#${part.Model} ${part.Description}`) // List of part descriptions and models
    };
  
    return reportData; // Return the organized report data
  };
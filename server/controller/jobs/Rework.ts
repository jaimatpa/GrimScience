import { Sequelize, Op } from "sequelize";
import  sequelize  from '../../utils/databse';  
import { QueryTypes } from 'sequelize';

export const getReworkCategories = async () => {
  
  const result =  await sequelize.query(`
    select distinct parttype from tblBP where uniqueid in (select max(uniqueid) as uniqueid from tblBP group by instanceid) order by parttype
  `, {
    type: QueryTypes.SELECT
  });

  const category = result
        .map((item) => item['parttype'])
        .filter((category) => category !== null);
        
  console.log(category)
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
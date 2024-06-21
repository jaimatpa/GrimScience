import { Op, Sequelize } from 'sequelize';
import { tblBP } from "~/server/models";

export const getProductLines = async () => {
  const distinctProductInfos = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('PRODUCTLINE')), 'PRODUCTLINE']
    ],
    where: {
      [Op.and]: [
        { PRODUCTLINE: { [Op.ne]: null } },
        { PRODUCTLINE: { [Op.ne]: '' } }
      ]
    },
    order: [
      ['PRODUCTLINE', 'ASC'],
    ]
  });

  const productLineValues = distinctProductInfos.map(result => result.get('PRODUCTLINE'));

  return productLineValues;
}

export const getProductCategories = async (productline) => {
  const distinctProductCategories = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('PARTTYPE')), 'PARTTYPE']
    ],
    where: {
      [Op.and]: [
        { PARTTYPE: { [Op.ne]: null } },
        { PARTTYPE: { [Op.ne]: '' } }
      ],
      PRODUCTLINE: productline
    },
    order: [
      ['PARTTYPE', 'ASC'],
    ]
  });
  
  const productLineValues = distinctProductCategories.map(result => result.get('PARTTYPE'));

  return productLineValues;
}

export const getProductSubCategories = async (productline, category) => {
  const distinctProductSubCategories = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('SUBCATEGORY')), 'SUBCATEGORY']
    ],
    where: {
      [Op.and]: [
        { SUBCATEGORY: { [Op.ne]: null } },
        { SUBCATEGORY: { [Op.ne]: '' } }
      ],
      PRODUCTLINE: productline, 
      PARTTYPE: category
    },
    order: [
      ['SUBCATEGORY', 'ASC'],
    ]
  });

  const productLineValues = distinctProductSubCategories.map(result => result.get('SUBCATEGORY'));

  return productLineValues;
}

export const getProductInfos = async () => {
  const productInfos = await tblBP.findAll({
    attributes: [
      'PRODUCTLINE',
      'PARTTYPE',
      'SUBCATEGORY',
    ],
    where: {
      PRODUCTLINE: {
        [Op.not]: ''
      },
    },
    order: [
      ['PRODUCTLINE', 'ASC'],
      ['PARTTYPE', 'ASC'],
      ['SUBCATEGORY', 'ASC'],
    ]
  });

  return productInfos;
}
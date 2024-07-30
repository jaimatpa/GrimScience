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

export const getProductCategories = async (filterParams) => {
  const { productline, partflag } = filterParams
  let where = {}
  if(productline) where['PRODUCTLINE'] = productline
  if(partflag) where['partflag'] = partflag
  const distinctProductCategories = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('PARTTYPE')), 'PARTTYPE']
    ],
    where: {
      [Op.and]: [
        { PARTTYPE: { [Op.ne]: null } },
        { PARTTYPE: { [Op.ne]: '' } }
      ],
      ...where
    },
    order: [
      ['PARTTYPE', 'ASC'],
    ]
  });
  
  const productLineValues = distinctProductCategories.map(result => result.get('PARTTYPE'));

  return productLineValues;
}

export const getProductSubCategories = async (filterParams) => {
  const { productline, category, partflag } = filterParams
  let where = {}
  if(productline !== undefined) where['PRODUCTLINE'] = productline
  if(category !== undefined) where['PARTTYPE'] = category
  if(partflag) where['partflag'] = partflag
  const distinctProductSubCategories = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('SUBCATEGORY')), 'SUBCATEGORY']
    ],
    where: {
      [Op.and]: [
        { SUBCATEGORY: { [Op.ne]: null } },
        { SUBCATEGORY: { [Op.ne]: '' } }
      ],
      ...where
    },
    order: [
      ['SUBCATEGORY', 'ASC'],
    ]
  });

  const productLineValues = distinctProductSubCategories.map(result => result.get('SUBCATEGORY'));

  return productLineValues;
}

export const getProductInfos = async (params) => {
  const { productline, category, subcategory, model, stock } = params
  let whereClause = {
    [Op.and]: [
      { PRIMARYPRICE1: { [Op.ne]: null } },
      { PRIMARYPRICE1: { [Op.ne]: '' } }
    ]
  };
  if (productline) {
    whereClause['PRODUCTLINE'] = productline
  } else return []
  if (category) {
    whereClause['PARTTYPE'] = category
  }
  if (subcategory) {
    whereClause['SUBCATEGORY'] = subcategory
  }
  const productInfos = await tblBP.findAll({
    attributes: [
      'UniqueID',
      'PRODUCTLINE',
      'PARTTYPE',
      'SUBCATEGORY',
      'PRIMARYPRICE1',
      'DESCRIPTION'
    ],
    where: whereClause,
    limit: 50,
    order: [
      ['PRODUCTLINE', 'ASC'],
      ['PARTTYPE', 'ASC'],
      ['SUBCATEGORY', 'ASC'],
    ]
  });

  return productInfos;
}

export const getParts = async (filterParams) => {
  const { UniqueID, PARTTYPE, SUBCATEGORY, MODEL, DESCRIPTION } = filterParams
  let where = {}
  if(UniqueID) where['UniqueID'] = UniqueID
  if(PARTTYPE) where['PARTTYPE'] = PARTTYPE
  if(SUBCATEGORY) where['SUBCATEGORY'] = SUBCATEGORY
  if(MODEL) where['MODEL'] = {[Op.like]: `%${MODEL}%`}
  if(DESCRIPTION) where['DESCRIPTION'] = {[Op.like]: `%${DESCRIPTION}%`}

  const productInfos = await tblBP.findAll({
    attributes: [
      'UniqueID',
      'instanceID',
      'PARTTYPE',
      'SUBCATEGORY',
      'MODEL',
      'DESCRIPTION',
      'OnHand',
      'PRIMARYPRICE1',
      'UNIT'
    ],
    where: {
      partflag: 1,
      ...where
    },
    limit: 50,
    order: [
      ['MODEL', 'ASC'],
    ],
    raw: true
  });

  return productInfos;
}

export const getDistinctParts = async (filterParams) => {
  const { UniqueID, PARTTYPE, SUBCATEGORY, MODEL, DESCRIPTION } = filterParams
  let where = {}
  if(UniqueID) where['UniqueID'] = UniqueID
  if(PARTTYPE) where['PARTTYPE'] = PARTTYPE
  if(SUBCATEGORY) where['SUBCATEGORY'] = SUBCATEGORY
  if(MODEL) where['MODEL'] = {[Op.like]: `%${MODEL}%`}
  if(DESCRIPTION) where['DESCRIPTION'] = {[Op.like]: `%${DESCRIPTION}%`}

  const getDistinctByModelNumber = (data) => {
    const uniquePrices = new Map();

    data.forEach(item => {
      if (!uniquePrices.has(item.MODEL)) {
        uniquePrices.set(item.MODEL, item);
      }
    });
  
    return Array.from(uniquePrices.values());
  };

  const productInfos = await tblBP.findAll({
    attributes: [
      'UniqueID',
      'instanceID',
      'PARTTYPE',
      'SUBCATEGORY',
      'MODEL',
      'DESCRIPTION',
      'OnHand',
      'PRIMARYPRICE1',
      'UNIT'
    ],
    where: {
      partflag: 1,
      ...where
    },
    // limit: 50,
    order: [
      ['MODEL', 'ASC'],
    ],
    raw: true
  });

  const distinctFilteredData = getDistinctByModelNumber(productInfos);

  return distinctFilteredData;
}

import { Op, Sequelize } from 'sequelize';
import { tblOrder, tblBP } from "~/server/models";

const applyFilters = (params) => {
  const filterParams = ['UniqueID', 'orderdate', 'status'];
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

export const orderExistByID = async (id: number | string) => {
  const tableDetail = await tblOrder.findByPk(id);
  if(tableDetail)
    return true;
  else
    return false;
}

export const getServiceOrders = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;

  const whereClause = applyFilters(filterParams);

  const list = await tblOrder.findAll({
    attributes: ['UniqueID', 'orderdate', 'status', 'warranty'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    offset,
    limit
  });
  const formattedList = list.map(item => {
    const formattedItem = item.toJSON();
    const orderDate = new Date(formattedItem.orderdate);
    formattedItem.orderdate = orderDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  
    return formattedItem;
  });
  return formattedList;
}

export const getAllServiceOrders = async (sortBy, sortOrder, filterParams) => {
  const whereClause = applyFilters(filterParams);

  const list = await tblOrder.findAll({
    attributes: ['UniqueID', 'orderdate', 'status', 'warranty'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
  });
  const formattedList = list.map(item => {
    const formattedItem = item.toJSON(); // Convert to a plain object
    const orderDate = new Date(formattedItem.orderdate);
  
    // Format the date
    formattedItem.orderdate = orderDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  
    return formattedItem;
  });
  return formattedList;
}

export const getNumberOfOrders = async (filterParams) => {
  const whereClause = applyFilters(filterParams);
  const numberOfCustomers = await tblOrder.count({
    where: whereClause
  });
  return numberOfCustomers;
}

export const getProductLines = async (filterParams) => {
  const distinctProductLines = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('PRODUCTLINE')), 'PRODUCTLINE']
    ],
    where: {
      PRODUCTLINE: {
        [Op.not]: ''
      },
    },
    order: [
      ['PRODUCTLINE', 'ASC'],
    ]
  });

  const productLineValues = distinctProductLines.map(result => result.get('PRODUCTLINE'));

  return productLineValues;
}

// export const getCustomerDetail = async (id) => {
//   const tableDetail = await tblOrder.findByPk(id);
//   return tableDetail
// }

// export const createCustomer = async (data) => {
//   const fullname = `${data.lname}, ${data.fname}`
//   const createReqData = {
//     ...data,
//     fullname: fullname
//   };
//   const newCustomer = await tblOrder.create(createReqData);
//   return newCustomer
// }

// export const updateCustomer = async (id, reqData) => {
//   let updatedReqData
//   if (typeof reqData.adddate === 'string'){
//     updatedReqData = {
//       ...reqData,
//       fullname: `${reqData.lname}, ${reqData.fname}`,
//       adddate: Sequelize.literal(`CAST('${reqData.adddate}' AS DATETIME)`)
//     };
//   } else {
//     updatedReqData = {
//       ...reqData,
//       fullname: `${reqData.lname}, ${reqData.fname}`
//     };
//   }
//   await tblOrder.update(updatedReqData, {
//     where: { UniqueID: id }
//   });
//   return id;
// }

// export const deleteCustomer = async (id) => {
//   await tblOrder.destroy({where: { UniqueID: id }});
//   return id;
// }

// export const getMarkets = async () => {
//   const result = await tblOrder.findAll({
//     attributes: [
//       [Sequelize.fn('DISTINCT', Sequelize.fn('TRIM', Sequelize.col('market'))), 'market']
//     ],
//     where: {
//       [Op.and]: [
//         { market: { [Op.ne]: null } },
//         { market: { [Op.ne]: '' } }
//       ]
//     },
//     order: [['market', 'ASC']],
//     raw: true
//   });

//   const distinctMarkets = result.map((item: any) => item.market);
//   return distinctMarkets;
// }

// export const getProfessions = async () => {
//   const result = await tblOrder.findAll({
//     attributes: [
//       [Sequelize.fn('DISTINCT', Sequelize.col('source')), 'source']
//     ],
//     where: {
//       [Op.and]: [
//         { source: { [Op.ne]: null } },
//         { source: { [Op.ne]: '' } }
//       ]
//     },
//     order: [['source', 'ASC']],
//     raw: true
//   });

//   const distinctProfessions = result.map((item: any) => item.source);
//   return distinctProfessions;
// }

// export const getCategories = async () => {
//   const result = await tblOrder.findAll({
//     attributes: [
//       [Sequelize.fn('DISTINCT', Sequelize.col('ParadynamixCatagory')), 'ParadynamixCatagory']
//     ],
//     where: {
//       [Op.and]: [
//         { ParadynamixCatagory: { [Op.ne]: null } },
//         { ParadynamixCatagory: { [Op.ne]: '' } }
//       ]
//     },
//     order: [['ParadynamixCatagory', 'ASC']],
//     raw: true
//   });

//   const distinctCategories = result.map((item: any) => item.ParadynamixCatagory);
//   return distinctCategories;
// }

// export const getConferences = async () => {
//   const result = await tblOrder.findAll({
//     attributes: [
//       [Sequelize.fn('DISTINCT', Sequelize.col('SourceConfrence')), 'SourceConfrence']
//     ],
//     where: {
//       [Op.and]: [
//         { SourceConfrence: { [Op.ne]: null } },
//         { SourceConfrence: { [Op.ne]: '' } }
//       ]
//     },
//     order: [['SourceConfrence', 'ASC']],
//     raw: true
//   });

//   const distinctCategories = result.map((item: any) => item.SourceConfrence);
//   return distinctCategories;
// }
import { Op, Sequelize } from 'sequelize';
import { tblOrder, tblCustomers, tblComplaints, tblBP } from "~/server/models";

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
  let whereClause = {}
  let customerWhereClause = {}
  if(filterParams.COMPLAINTNUMBER) whereClause['COMPLAINTNUMBER'] = {[Op.like]: `%${filterParams.COMPLAINTNUMBER}%`};
  if(filterParams.SERIALNO) whereClause['SERIALNO'] = {[Op.like]: `%${filterParams.SERIALNO}%`};
  if(filterParams.COMPLAINTDATE) whereClause[Op.and] = [
      Sequelize.where(Sequelize.fn('FORMAT', Sequelize.col('COMPLAINTDATE'), 'MM/dd/yyyy'), {
        [Op.like]: Sequelize.literal(`'%${filterParams.COMPLAINTDATE}%'`)
      })
    ]
  if(filterParams.FAILINVEST) whereClause['FAILINVEST'] = {[Op.like]: `%${filterParams.FAILINVEST}%`};
  if(filterParams.company) customerWhereClause['company1'] = {[Op.like]: `%${filterParams.company}%`};
  tblComplaints.hasOne(tblCustomers, {foreignKey: 'UniqueID', sourceKey: 'CustomerID'})
  const list = await tblComplaints.findAll({
    attributes: [
      'uniqueID',
      'COMPLAINTNUMBER',
      'SERIALNO',
      'COMPLAINTDATE',
      'FAILINVEST',
      'OPENCASE',
      'INJURYREPORTNO',
      'WarrentyService',
      [Sequelize.col('tblCustomer.company1'), 'company1']
    ],
    include: [
      {
        model: tblCustomers,
        attributes: ['company1'],
        where: customerWhereClause
      }
    ],
    where: {
      OPENCASE: 0,
      ...whereClause
    },
    order: [[sortBy as string || 'COMPLAINTNUMBER', sortOrder as string || 'DESC']],
    offset,
    limit,
    raw: true
  })
  const formattedList = list.map((item: any) => {
    let openCase;
    let injury;
    let warranty;
    if(item.OPENCASE === '0') 
      openCase = 'OPEN'
    else
      openCase = 'CLOSE'
    if(item.injury === 0)
      injury = 'NO'
    else 
      injury = 'YES'
    if(item.WarrentyService === -1)
      warranty = 'YES'
    else
      warranty = 'NO'
    let complaintDate = new Date(item.COMPLAINTDATE).toISOString().split('T')
    complaintDate = complaintDate[0].split('-')
    let formattedDate = `${complaintDate[1]}/${complaintDate[2]}/${complaintDate[0]}`
    return {
      uniqueID: item.uniqueID,
      COMPLAINTNUMBER: item.COMPLAINTNUMBER,
      SERIALNO: item.SERIALNO,
      FAILINVEST: item.FAILINVEST,
      COMPLAINTDATE: formattedDate,
      Status: openCase,
      INJURYREPORTNO: injury,
      Warranty: warranty,
      company1: item['tblCustomer.company1']
    }
  })
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

export const getNumberOfServiceOrders = async (filterParams) => {
  let whereClause = {}
  let customerWhereClause = {}
  if(filterParams.COMPLAINTNUMBER) whereClause['COMPLAINTNUMBER'] = {[Op.like]: `%${filterParams.COMPLAINTNUMBER}%`};
  if(filterParams.SERIALNO) whereClause['SERIALNO'] = {[Op.like]: `%${filterParams.SERIALNO}%`};
  if(filterParams.COMPLAINTDATE) whereClause[Op.and] = [
      Sequelize.where(Sequelize.fn('FORMAT', Sequelize.col('COMPLAINTDATE'), 'MM/dd/yyyy'), {
        [Op.like]: Sequelize.literal(`'%${filterParams.COMPLAINTDATE}%'`)
      })
    ]
  if(filterParams.FAILINVEST) whereClause['FAILINVEST'] = {[Op.like]: `%${filterParams.FAILINVEST}%`};
  if(filterParams.company) customerWhereClause['company1'] = {[Op.like]: `%${filterParams.company}%`};
  tblComplaints.hasOne(tblCustomers, {foreignKey: 'UniqueID', sourceKey: 'CustomerID'})
  const numberOfServiceOrders = await tblComplaints.count({
    include: [
      {
        model: tblCustomers,
        attributes: ['company1'],
        where: customerWhereClause
      }
    ],
    where: {
      OPENCASE: 0,
      ...whereClause
    },
  })
  return numberOfServiceOrders;
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
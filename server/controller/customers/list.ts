import { Op, Sequelize } from 'sequelize';
import { tblCustomers, tblOrder, tblOrderDetail, tblSourceCodes, tblEmployee } from "~/server/models";

const applyFilters = (params) => {
  const filterParams = ['number', 'fname', 'lname', 'company1', 'homephone', 'workphone', 'state', 'zip', 'market', 'source', 'SourceConfrence', 'ParadynamixCatagory'];
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

export const customerExistByID = async (id: number | string) => {
  const tableDetail = await tblCustomers.findByPk(id);
  if(tableDetail)
    return true;
  else
    return false;
}

export const getCustomers = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;

  const whereClause = applyFilters(filterParams);

  const list = await tblCustomers.findAll({
    attributes: ['UniqueID', 'number', 'fname', 'lname', 'company1', 'homephone', 'workphone', 'state', 'zip'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    offset,
    limit
  });
  return list;
}

export const getAllCustomers = async (sortBy, sortOrder, filterParams) => {
  const whereClause = applyFilters(filterParams);

  const list = await tblCustomers.findAll({
    attributes: ['UniqueID', 'number', 'fname', 'lname', 'company1', 'homephone', 'workphone', 'state', 'zip'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
  });
  return list;
}

export const getNumberOfCustomers = async (filterParams) => {
  const whereClause = applyFilters(filterParams);
  const numberOfCustomers = await tblCustomers.count({
    where: whereClause
  });
  return numberOfCustomers;
}

export const getCustomerDetail = async (id) => {
  const tableDetail = await tblCustomers.findByPk(id);
  return tableDetail
}

export const createCustomer = async (data) => {
  const fullname = `${data.lname}, ${data.fname}`
  const createReqData = {
    ...data,
    fullname: fullname
  };
  const newCustomer = await tblCustomers.create(createReqData);
  return newCustomer
}

export const updateCustomer = async (id, reqData) => {
  let updatedReqData
  if (typeof reqData.adddate === 'string'){
    updatedReqData = {
      ...reqData,
      fullname: `${reqData.lname}, ${reqData.fname}`,
      adddate: Sequelize.literal(`CAST('${reqData.adddate}' AS DATETIME)`)
    };
  } else {
    updatedReqData = {
      ...reqData,
      fullname: `${reqData.lname}, ${reqData.fname}`
    };
  }
  await tblCustomers.update(updatedReqData, {
    where: { UniqueID: id }
  });
  return id;
}

export const deleteCustomer = async (id) => {
  await tblCustomers.destroy({where: { UniqueID: id }});
  return id;
}

export const getMarkets = async () => {
  const result = await tblCustomers.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.fn('TRIM', Sequelize.col('market'))), 'market']
    ],
    where: {
      [Op.and]: [
        { market: { [Op.ne]: null } },
        { market: { [Op.ne]: '' } }
      ]
    },
    order: [['market', 'ASC']],
    raw: true
  });

  const distinctMarkets = result.map((item: any) => item.market);
  return distinctMarkets;
}

export const getProfessions = async () => {
  const result = await tblCustomers.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('source')), 'source']
    ],
    where: {
      [Op.and]: [
        { source: { [Op.ne]: null } },
        { source: { [Op.ne]: '' } }
      ]
    },
    order: [['source', 'ASC']],
    raw: true
  });

  const distinctProfessions = result.map((item: any) => item.source);
  return distinctProfessions;
}

export const getCategories = async () => {
  const result = await tblCustomers.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('ParadynamixCatagory')), 'ParadynamixCatagory']
    ],
    where: {
      [Op.and]: [
        { ParadynamixCatagory: { [Op.ne]: null } },
        { ParadynamixCatagory: { [Op.ne]: '' } }
      ]
    },
    order: [['ParadynamixCatagory', 'ASC']],
    raw: true
  });

  const distinctCategories = result.map((item: any) => item.ParadynamixCatagory);
  return distinctCategories;
}

export const getConferences = async () => {
  const result = await tblCustomers.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('SourceConfrence')), 'SourceConfrence']
    ],
    where: {
      [Op.and]: [
        { SourceConfrence: { [Op.ne]: null } },
        { SourceConfrence: { [Op.ne]: '' } }
      ]
    },
    order: [['SourceConfrence', 'ASC']],
    raw: true
  });

  const distinctCategories = result.map((item: any) => item.SourceConfrence);
  return distinctCategories;
}

export const getSerialsByID = async (id: Number | String) => {
  tblOrderDetail.hasOne(tblOrder, { foreignKey: 'UniqueID', sourceKey: 'orderid' })
  tblOrder.belongsTo(tblCustomers, { foreignKey: 'customerid', targetKey: 'UniqueID' })
  const list = await tblOrderDetail.findAll({
    attributes: [ 
      'serial'
    ], 
    include: [
      {
        model: tblOrder,
        attributes: ['UniqueID'],
        required: true,
        include: [
          {          
            model: tblCustomers,
            attributes: ['UniqueID'],
          }
        ]
      }, 
    ],
    where: {
      '$tblOrder.tblCustomer.UniqueID$': id
    },
    order: [['serial', 'ASC']],
    raw: true
  });
  const result = list.map((obj: any) => {
    return {
      serial: obj.serial
    }
  });
  return result;
}

export const getSources = async () => {
  const list = await tblSourceCodes.findAll({
    attributes: [ 
      [Sequelize.fn('DISTINCT', Sequelize.col('source')), 'source']
    ], 
    where: {
      [Op.and]: [
        { source: { [Op.ne]: null } },
        { source: { [Op.ne]: '' } }
      ]
    }
  })
  const result = list.map((item: any) => {
    return item.source
  })
  return result;
}

export const getSourceDescriptiosBySource = async (source: string | number) => {
  const list = await tblSourceCodes.findAll({
    attributes: [ 
      [Sequelize.fn('DISTINCT', Sequelize.col('description')), 'description']
    ], 
    where: {
      [Op.and]: [
        { description: { [Op.ne]: null } },
        { description: { [Op.ne]: '' } }
      ],
      source: source
    },
    order: [['description', 'ASC']]
  })
  const result = list.map((item: any) => {
    return item.description
  })
  return result;
}

export const getEmployeesWithPayrollNumber = async () => {
  const list = await tblEmployee.findAll({
    attributes: [ 
      'fname',
      'lname',
      'payrollnumber'
    ], 
    where: {
      Active: true
    },
    order: [['payrollnumber', 'ASC']]
  })
  const result = list.map((item: any) => {
    return `#${item.payrollnumber} ${item.fname} ${item.lname}`
  })
  return result;
}
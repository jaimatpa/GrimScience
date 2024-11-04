import { tblBP } from '~/server/models'; 
import { Op, Sequelize } from 'sequelize';
import  sequelize  from '../../utils/databse';  
import { QueryTypes } from 'sequelize';

const formatDate = (date) => {
  const today = new Date(date);
  return String(today.getMonth() + 1).padStart(2, '0')  + '/' + 
  String(today.getDate()).padStart(2, '0') + '/' + 
  today.getFullYear();
}

export const getProductLine = async () => {
  const result = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('PRODUCTLINE')), 'PRODUCTLINE']
    ],
    where: {
      [Op.and]: [
        { PRODUCTLINE: { [Op.ne]: null } },
        { PRODUCTLINE: { [Op.ne]: '' } }
      ]
    },
    order: [['PRODUCTLINE', 'ASC']],
    raw: true
  });

  const distinctProductLine = result.map((item: any) => item.PRODUCTLINE);
  return distinctProductLine;
}

export const getCategories = async () => {
  
  const result =  await sequelize.query(`
    Select distinct sourcedescription from tblcustomers order by sourcedescription
  `, {
    type: QueryTypes.SELECT
  });
  
  const distinctitem = result.map((item: any) => item['sourcedescription']).filter((item) => {
    if( !(item == null || item == "" || item == " ") ) {
      return item
    }
  });

  return distinctitem;
}

export const getConfrence = async () => {
  
  const result =  await sequelize.query(`
    Select distinct sourceconfrence from tblcustomers order by sourceconfrence
  `, {
    type: QueryTypes.SELECT
  });
  
  const distinctitem = result.map((item: any) => item['sourceconfrence']).filter((item) => {
    if( !(item == null || item == "" || item == " ") ) {
      return item
    }
  });

  return distinctitem;
}

export const getProfessions = async () => {
  
  const result =  await sequelize.query(`
    Select distinct source from tblcustomers order by source
  `, {
    type: QueryTypes.SELECT
  });
  
  const distinctitem = result.map((item: any) => item['source']).filter((item) => {
    if( !(item == null || item == "" || item == " ") ) {
      return item
    }
  });

  return distinctitem;
}

export const getMarket = async () => {
  
  const result =  await sequelize.query(`
    select distinct market from tblcustomers order by market
  `, {
    type: QueryTypes.SELECT
  });
  
  const distinctitem = result.map((item: any) => item['market']).filter((item) => {
    if( !(item == null || item == "" || item == " ") ) {
      return item
    }
  });

  return distinctitem;
}

export const getSources = async () => {
  
  const result =  await sequelize.query(`
    Select distinct source from tblorder order by source asc
  `, {
    type: QueryTypes.SELECT
  });
  
  const distinctitem = result.map((item: any) => item['source']).filter((item) => {
    if( !(item == null || item == "" || item == " ") ) {
      return item
    }
  });

  return distinctitem;
}

export const getSourceDescriptions = async (source) => {
  
  const result =  await sequelize.query(`
    Select distinct sourcedescription from tblorder Where Source = :source order by sourcedescription asc
  `, {
    replacements: { source },
    type: QueryTypes.SELECT
  });
  
  const distinctitem = result.map((item: any) => item['sourcedescription']).filter((item)  => {
    if( !(item == null || item == "" || item == " ") ) {
      return item
    }
  });

  return distinctitem;
}

export const getStates = async () => {
  
  const result =  await sequelize.query(`
    select distinct state from tblcustomers order by state
  `, {
    type: QueryTypes.SELECT
  });
  
  const distinctitem = result.map((item: any) => item['state']).filter((item) => {
    if( !(item == null || item == "" || item == " ") ) {
      return item
    }
  });

  return distinctitem;
}

export const getSalesReport = async (page, pageSize, filters, startDate, endDate) => {
  try {

    filters = JSON.parse(filters)
    // Start building the query string
    let queryStr = "SELECT * FROM vwSales WHERE 1=1";
    
    for(const key in filters.tableFilters){
      if(filters.tableFilters[key]){
        queryStr += ` AND ${key} LIKE '${filters.tableFilters[key]}%'`;
      }
      
    }

    // Applying additional filters (productline, model, etc.)
    if (filters.productline) {
        queryStr += ` AND productline = '${filters.productline}'`;
    }
    if (filters.model) {
        queryStr += ` AND (model LIKE '%${filters.model}%' OR model IS NULL)`;
    }
    if (filters.market) {
        queryStr += ` AND (market LIKE '%${filters.market}%' OR market IS NULL)`;
    }
    if (filters.profession) {
        queryStr += ` AND (csource LIKE '%${filters.profession}%' OR csource IS NULL)`;
    }
    if (filters.category) {
        queryStr += ` AND (csourcedescription LIKE '%${filters.category}%' OR csourcedescription IS NULL)`;
    }
    if (filters.confrence) {
        queryStr += ` AND (sourceconfrence LIKE '%${filters.confrence}%' OR sourceconfrence IS NULL)`;
    }
    if (filters.state) {
        queryStr += ` AND (state LIKE '%${filters.state}%' OR state IS NULL)`;
    }
    if (filters.zip) {
        queryStr += ` AND (zip LIKE '%${filters.zip}%' OR zip IS NULL)`;
    }
    if (filters.source) {
        queryStr += ` AND (source LIKE '%${filters.source}%' OR source IS NULL)`;
    }
    if (filters.sourceDescription) {
        queryStr += ` AND (sourcedescription LIKE '%${filters.sourceDescription}%' OR sourcedescription IS NULL)`;
    }

    startDate = formatDate(startDate)
    endDate = formatDate(endDate)

    queryStr += ` AND CAST(OrderDate AS DATETIME) BETWEEN '${startDate}' AND '${endDate}'`
    const metQueryStr = queryStr.replace("SELECT *", "SELECT SOLD, quantity");
    const metrics = await sequelize.query(metQueryStr, { type: QueryTypes.SELECT });
    
    let total = 0
    let units = 0

    metrics.forEach(item => {
      if(item.SOLD && item.quantity){
        total = total + (item.SOLD * item.quantity)
        units = units + item.quantity
      }
    })

    // Calculate pagination values
    const cntQueryStr = queryStr.replace("SELECT *", "SELECT COUNT(*) AS totalRows");
    const totalRow = await sequelize.query(cntQueryStr, { type: QueryTypes.SELECT });

    const limit = parseInt(pageSize as string, 10) || 10;
    const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;


    // Append LIMIT and OFFSET for pagination
    queryStr += ` ORDER BY [invoicenumber] OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

    // Execute the raw SQL query
    const results = await sequelize.query(queryStr, { type: QueryTypes.SELECT });

    // Return the results
    return {results, totalReports: totalRow[0].totalRows, total:total.toFixed(2), units};

  } catch (error) {
      console.error('Error', error);
      throw error;
  }
}

export const getExcelSalesReport = async ( filters, startDate, endDate) => {
  try {
    filters = JSON.parse(filters)
    // Start building the query string
    let queryStr = "SELECT * FROM vwSales WHERE 1=1";
    
    for(const key in filters.tableFilters){
      if(filters.tableFilters[key]){
        queryStr += ` AND ${key} LIKE '${filters.tableFilters[key]}%'`;
      }
      
    }

    // Applying additional filters (productline, model, etc.)
    if (filters.productline) {
        queryStr += ` AND productline = '${filters.productline}'`;
    }
    if (filters.model) {
        queryStr += ` AND (model LIKE '%${filters.model}%' OR model IS NULL)`;
    }
    if (filters.market) {
        queryStr += ` AND (market LIKE '%${filters.market}%' OR market IS NULL)`;
    }
    if (filters.profession) {
        queryStr += ` AND (csource LIKE '%${filters.profession}%' OR csource IS NULL)`;
    }
    if (filters.category) {
        queryStr += ` AND (csourcedescription LIKE '%${filters.category}%' OR csourcedescription IS NULL)`;
    }
    if (filters.confrence) {
        queryStr += ` AND (sourceconfrence LIKE '%${filters.confrence}%' OR sourceconfrence IS NULL)`;
    }
    if (filters.state) {
        queryStr += ` AND (state LIKE '%${filters.state}%' OR state IS NULL)`;
    }
    if (filters.zip) {
        queryStr += ` AND (zip LIKE '%${filters.zip}%' OR zip IS NULL)`;
    }
    if (filters.source) {
        queryStr += ` AND (source LIKE '%${filters.source}%' OR source IS NULL)`;
    }
    if (filters.sourceDescription) {
        queryStr += ` AND (sourcedescription LIKE '%${filters.sourceDescription}%' OR sourcedescription IS NULL)`;
    }

    startDate = formatDate(startDate)
    endDate = formatDate(endDate)

    queryStr += ` AND CAST(OrderDate AS DATETIME) BETWEEN '${startDate}' AND '${endDate}'`

    // Execute the raw SQL query
    const results = await sequelize.query(queryStr, { type: QueryTypes.SELECT });
    
    // Return the results
    return { results };

  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
}


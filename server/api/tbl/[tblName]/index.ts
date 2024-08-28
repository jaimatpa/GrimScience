import { createTableRow, getTableList, getTableWhere } from "~/server/controller/common";

export default eventHandler(async (event) => {
  try {
    const tblName = event.context.params.tblName;
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'GET':
        const query = getQuery(event);
        let list = [];
        if(Object.keys(query).length > 0){
          let orderby = null;
          if(query.orderby){
            orderby = query.orderby;
            orderby = orderby.split(',');
            delete query.orderby;
          }
          let orderdirection = null;
          if(query.orderdirection){
            orderdirection = query.orderdirection;
            orderdirection = orderdirection.split(',');
            orderby = orderby.map((item, index)=>{
              return [item, orderdirection[index]||'ASC']
            })
            delete query.orderdirection;
          }
          list = await getTableWhere({tblName, where:query, orderby});
        }else list = await getTableList({ tblName });
        return { body: list, message: "Table list retrieved successfully." };
      case 'POST':
        const data = await readBody(event);
        const newRecord = await createTableRow({ tblName, data });
        setResponseStatus(event, 201);
        return { body: newRecord, message: "New record created successfully." };
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error(error);
    if (error.message.includes('Validation') || error.message.includes('already exists')) {
      setResponseStatus(event, 400);
    } else if (error.message.endsWith('not defined') || error.message.includes('not found') || error.message.includes('not exist')) {
      setResponseStatus(event, 404);
    } else {
      setResponseStatus(event, 500);
    }
    return { error: error.message };
  }
});

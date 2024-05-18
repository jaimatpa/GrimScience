import { getTableDetail } from "~/server/controller/CommonCRUD";

export default eventHandler(async (event) => {
  try {
    const tblName = event.context.params.tblName;
    const id = event.context.params.id;
    const method = event._method;

    let statusCode;
    let response;

    switch(method.toUpperCase()){
      case 'GET':
        const detail = await getTableDetail({ tblName, id });
        statusCode = 200;
        response = {
          statusCode,
          body: detail
        };
        break;
      case 'PUT':
        break;
      case 'DELETE':
        break;
      default:
        statusCode = 404;
        response = {
          statusCode,
          body: JSON.stringify({ error: 'Method Not Allowed' })
        };
        break;
    }

    return response;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
})
import { getTableDetail } from "~/server/controller/CommonRead";

export default eventHandler(async (event) => {
  try {
    const tblName = event.context.params.tblName;
    const id = event.context.params.id;
    const method = event._method;

    let response;

    switch(method.toUpperCase()){
      case 'GET':
        const detail = await getTableDetail({ tblName, id });
        response = {
          statusCode: 200,
          body: detail
        };
        break;
      case 'PUT':
        break;
      case 'DELETE':
        break;
      default:
        response = {
          statusCode: 404,
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
import { getTableList } from "~/server/controller/CommonCRUD";

export default eventHandler(async (event) => {
  try {
    const tblName = event.context.params.tblName;
    const method = event._method;

    let response;

    switch (method.toUpperCase()) {
      case 'GET':
        const list = await getTableList({ tblName });
        response = {
          statusCode : 200,
          body: list
        };
        break;
      case 'POST':
        // Add POST method logic here
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
});

import { getTableList } from "~/server/controller/cop";

export default eventHandler(async (event) => {
  try {
    const tblName = event.context.params.tblName;
    const method = event._method;

    let statusCode;
    let response;

    switch (method.toUpperCase()) {
      case 'GET':
        const list = await getTableList({ tblName });
        statusCode = 200;
        response = {
          statusCode,
          body: list
        };
        break;
      case 'POST':
        // Add POST method logic here
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
});

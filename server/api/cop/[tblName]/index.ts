import { getTableList } from "~/server/controller/cop";

export default eventHandler(async (event) => {
  try {
    console.log(event);
    const tblName = event.context.params.tblName;
    const method = event._method;

    let statusCode;
    let response;

    switch (method.toUpperCase()) {
      case 'GET':
        const list = await getTableList({ tblName });
        const dataValuesList = list.map(item => item.dataValues);
        statusCode = 200;
        response = {
          statusCode,
          body: dataValuesList
        };
        break;
      case 'POST':
        // Add POST method logic here
        break;
      default:
        statusCode = 404;
        response = {
          statusCode,
          body: JSON.stringify({ message: 'Method Not Allowed' })
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

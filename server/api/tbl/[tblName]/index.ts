import { createTableRow, getTableList } from "~/server/controller/common";

export default eventHandler(async (event) => {
  try {
    const tblName = event.context.params.tblName;
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'GET':
        const list = await getTableList({ tblName });
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

import { getTableDetail, updateTableRow, deleteTableRow } from "~/server/controller/common";

export default eventHandler(async (event) => {
  try {
    const tblName = event.context.params.tblName;
    const id = event.context.params.id;
    const method = event._method;
    switch (method.toUpperCase()) {
      case 'GET':
        const detail = await getTableDetail({ tblName, id });
        return { body: detail, message: "Table detail retrieved successfully." };
      case 'PUT':
        const data = await readBody(event);
        const updatedResult = await updateTableRow({ tblName, id, data });
        return { body: updatedResult, message: "Table row updated successfully." };
      case 'DELETE':
        const deleteResult = await deleteTableRow({ tblName, id });
        return { body: deleteResult, message: "Table row deleted successfully." };
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    if (error.message.includes('Validation') || error.message.includes('already exists')) {
      setResponseStatus(event, 400);
    } else if (error.message.endsWith('not defined') || error.message.includes('not found') || error.message.includes('not exist')) {
      setResponseStatus(event, 404);
    } else {
      setResponseStatus(event, 500);
    }
    return { error: error.message };
  }
})
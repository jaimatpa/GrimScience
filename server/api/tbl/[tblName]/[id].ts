import { getTableDetail } from "~/server/controller/common/CommonRead";
import { updateTableRow } from "~/server/controller/common/CommonUpdate";

export default eventHandler(async (event) => {
  try {
    const tblName = event.context.params.tblName;
    const id = event.context.params.id;
    const method = event._method;
    switch(method.toUpperCase()){
      case 'GET':
        const detail = await getTableDetail({ tblName, id });
        return { body: detail };
      case 'PUT':
        const data = await readBody(event);
        updateTableRow({tblName, id, data});
        break;
      // case 'DELETE':
      //   break;
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    if (error.message.endsWith('not defined')) {
      setResponseStatus(event, 404);
      return { error: error.message };
    } else {
      setResponseStatus(event, 500);
      return { error: error.message };
    }
  }
})
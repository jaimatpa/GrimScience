import { createTableRow } from "~/server/controller/common/CommonCreate";
import { getTableList } from "~/server/controller/common/CommonRead";
import { deleteTableRows } from "~/server/controller/common/CommonDelete";

export default eventHandler(async (event) => {
  try {
    const tblName = event.context.params.tblName;
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'GET':
        const list = await getTableList({ tblName });
        return { body: list };
      case 'POST':
        const data = await readBody(event);
        const newRecord = await createTableRow({ tblName, data });
        setResponseStatus(event, 201);
        return { body: newRecord };
      case 'DELETE':
        const deleteReq: Object = await readBody(event);
        const deleteCount = await deleteTableRows({ tblName: tblName, where: deleteReq })
        setResponseStatus(event, 200);
        return { body: deleteCount + " items are deleted" }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    if (error.message.endsWith('not defined')) {
      setResponseStatus(event, 404);
    } else if(error.message.includes('already exists')){
      setResponseStatus(event, 400);
    } else {
      setResponseStatus(event, 500);
    }
    return { error: error.message };
  }
});

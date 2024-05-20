import { getTableDetail } from "~/server/controller/CommonRead";

export default eventHandler(async (event) => {
  try {
    const tblName = event.context.params.tblName;
    const id = event.context.params.id;
    const method = event._method;

    switch(method.toUpperCase()){
      case 'GET':
        const detail = await getTableDetail({ tblName, id });
        return { body: detail };
      // case 'PUT':
      //   break;
      // case 'DELETE':
      //   break;
      default:
        setResponseStatus(event, 404);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return { error: error.message };
  }
})
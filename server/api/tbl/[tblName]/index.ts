import { getTableList } from "~/server/controller/CommonRead";

export default eventHandler(async (event) => {
  try {
    const tblName = event.context.params.tblName;
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'GET':
        const list = await getTableList({ tblName });
        return { body: list };
      // case 'POST':
      //   break;
      default:
        setResponseStatus(event, 404);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return { error: error.message };
  }
});

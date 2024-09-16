import { getCapaDetail } from "~/server/controller/engineering/Capa";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const id = event.context.params.id;

    switch(method){
      case 'GET':
        const capaDetail = await getCapaDetail(id);
        if (capaDetail) return { body: capaDetail, message: "" };
        else {
            setResponseStatus(event, 404);
            return { error: "The Investigation does not exist" };
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
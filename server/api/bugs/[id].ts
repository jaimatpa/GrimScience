import { bugExistByID, deleteBug, getBugDetail, updateBug } from "~/server/controller/bugs/Bug";

export default eventHandler(async (event) => {
  try {
    const method = event._method;

    const id = event.context.params.id;
    const idExist = await bugExistByID(id);

    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){
          const detail = await getBugDetail(id)

          return { body: detail, message: 'Success!' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The bug does not exist!' }
        }
   
      case 'PUT':
        if (idExist) {
          const reqData = await readBody(event);
          const updatedID = await updateBug(id, reqData);
          return { body: { updatedID }, message: 'The bug updated successfully!' };
        } else {
            setResponseStatus(event, 404);
            return { error: 'The bug does not exist!' }
          }

        case 'DELETE':
          if (idExist) {
            const deletedID = await deleteBug(id);

            return { body: { deletedID }, message: 'Bug deleted successfully!' }
          } else {
              setResponseStatus(event, 404);
              return { error: 'The bug does not exist' }
            }
        default:
          setResponseStatus(event, 405);
          return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
    }
});

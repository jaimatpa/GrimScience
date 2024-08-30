import { deleteSerial, getSerialDetail, serialExistByID } from "~/server/controller/materials/serials";

export default eventHandler(async (event) => {
    try {
        const id = event.context.params.id;
        const method = event._method;

        const idExist = await serialExistByID(id);
        switch (method.toUpperCase()) {
            case "GET":
                if (idExist) {
                    const detail = await getSerialDetail(id);
                    return { body: detail, message: "" };
                } else {
                    setResponseStatus(event, 404);
                    return { error: "The serial does not exist" };
                }

            // case 'PUT':
            //   if (idExist) {
            //     const reqData = await readBody(event);
            //     const updatedID = await updateCustomer(id, reqData)
            //     return { body: { updatedID }, message: 'Customer updated successfully' };
            //   } else {
            //     setResponseStatus(event, 404);
            //     return { error: 'The customer does not exist' }
            //   }
            case 'DELETE':
              if (idExist) {
                const deletedID = await deleteSerial(id);
                return { body: { deletedID }, message: 'Serial deleted successfully' }
              } else {
                setResponseStatus(event, 404);
                return { error: 'The serial does not exist' }
              }
            default:
                setResponseStatus(event, 405);
                return { error: "Method Not Allowed" };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});

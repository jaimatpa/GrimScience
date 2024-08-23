import { OperationExistByID, deleteOperation, getJobOperationDetail, updateJobOperation, } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
    try {
        const id = event.context.params.id;
        const method = event._method;

        const idExist = await OperationExistByID(id);

        switch (method.toUpperCase()) {
            case 'GET':
                if (idExist) {
                    const detail = await getJobOperationDetail(id)
                    return { body: detail, message: '' };
                } else {
                    setResponseStatus(event, 404);
                    return { error: 'The Job operation does not exist' }
                }
            case 'PUT':
                if (idExist) {
                    const reqData = await readBody(event);
                    const updatedID = await updateJobOperation(id, reqData)
                    return { body: { updatedID }, message: 'Job operation updated successfully' };
                } else {
                    setResponseStatus(event, 404);
                    return { error: 'The Job operation does not exist' }
                }
            case 'DELETE':
                if (idExist) {
                    const deletedID = await deleteOperation(id);
                    return { body: { deletedID }, message: 'Operation deleted successfully' }
                } else {
                    setResponseStatus(event, 404);
                    return { error: 'The Job operation does not exist' }
                }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }

    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});
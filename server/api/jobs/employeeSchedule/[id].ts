import { OperationExistByID, deleteJob, deleteOperation, } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
    try {
        const id = event.context.params.id;
        const method = event._method;

        const idExist = await OperationExistByID(id);

        switch (method.toUpperCase()) {
            case 'DELETE':
                if (idExist) {
                    const deletedID = await deleteOperation(id);
                    return { body: { deletedID }, message: 'Operation deleted successfully' }
                } else {
                    setResponseStatus(event, 404);
                    return { error: 'The Job does not exist' }
                }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }

    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});
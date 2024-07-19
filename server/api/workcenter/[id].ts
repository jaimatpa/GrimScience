import { updateWorkCenter, WorkCenterExistById } from '~/server/controller/workcenter';

export default eventHandler(async (event) => {
    try {
        const id = event.context.params.id;
        const method = event._method;

        const idExist = await WorkCenterExistById(id);

        switch (method.toUpperCase()) {
            case 'PUT':
                if (idExist) {
                    const reqData = await readBody(event);
                    const updatedID = await updateWorkCenter(id, reqData)
                    return { body: { updatedID }, message: 'WorkCenter updated successfully' };
                } else {
                    setResponseStatus(event, 404);
                    return { error: 'The Skill does not exist' }
                }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }

    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});
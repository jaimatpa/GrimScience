import { deleteSkill, getSkillDetail, SkillExistById, updateSkill } from '~/server/controller/skills';

export default eventHandler(async (event) => {
    try {
        const id = event.context.params.id;
        const method = event._method;

        const idExist = await SkillExistById(id);

        switch (method.toUpperCase()) {
            case 'GET':
                if (idExist) {
                    const detail = await getSkillDetail(id)
                    return { body: detail, message: '' };
                } else {
                    setResponseStatus(event, 404);
                    return { error: 'The Skill does not exist' }
                }
            case 'PUT':
                if (idExist) {
                    const reqData = await readBody(event);
                    const updatedID = await updateSkill(id, reqData)
                    return { body: { updatedID }, message: 'Skill updated successfully' };
                } else {
                    setResponseStatus(event, 404);
                    return { error: 'The Skill does not exist' }
                }
            case 'DELETE':
                if (idExist) {
                    const deletedID = await deleteSkill(id);
                    return { body: { deletedID }, message: 'Skill deleted successfully' }
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
import { getSkillsSubCatagory } from '~/server/controller/skills';

export default eventHandler(async (event) => {
    try {
        const method = event._method;
        const query = getQuery(event);
        const category = query.category || null;
        console.log(category)
        switch (method.toUpperCase()) {
            case 'GET':
                const catagory = await getSkillsSubCatagory(category)
                return { body: catagory, message: 'Sub Catagory Fetched Successfully' }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});
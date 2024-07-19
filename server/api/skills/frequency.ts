import { getSkillsFrequency } from '~/server/controller/skills';

export default eventHandler(async (event) => {
    try {
        const method = event._method;

        switch (method.toUpperCase()) {
            case 'GET':
                const catagory = await getSkillsFrequency()
                return { body: catagory, message: 'Catagory Fetched Successfully' }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});
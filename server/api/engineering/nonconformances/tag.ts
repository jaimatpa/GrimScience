import {
    getNonConformanceTags,
    addNonConformancesTags,
    deleteNonConformancesTag
} from '~/server/controller/engineering';

export default eventHandler(async (event) => {
    try {
        const method = event._method;
        const params = getQuery(event);
        console.log({ method });
        switch (method) {
            case 'GET':
                const nonconformances = await getNonConformanceTags(params)
                return { body: nonconformances, message: '' }
            case 'POST':
                const body = await readBody(event);
                const createdNonconformances = await addNonConformancesTags(body)
                return { body: createdNonconformances, message: '' }
            case 'DELETE':
                const deleted = await deleteNonConformancesTag(params.id)
                return { body: deleted, message: '' }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }

    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});
import {
  addNonConformances,
  deleteNonConformances,
  getNonConformances,
} from '~/server/controller/engineering';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { ...params } = getQuery(event);
    switch (method) {
      case 'GET':
        const nonconformances = await getNonConformances(params)
        return { body: nonconformances, message: '' }
      case 'POST':
        const body = await readBody(event);
        console.log(body)
        const createdNonconformances = await addNonConformances(body)
        return { body: createdNonconformances, message: '' }
      case 'DELETE':
        const deleted = await deleteNonConformances(params.id)
        return { body: deleted, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }

  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
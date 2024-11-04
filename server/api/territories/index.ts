import { getTerritories, addTerritory } from '~/server/controller/territories';

export default eventHandler(async (event) => {
  try {
    const { ...filterParams } = getQuery(event);
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'GET':
        const list = await getTerritories( filterParams );
        return { body: list, message: '' }
      case 'POST':
        const {name, salesRep, serviceTech, states} = await readBody(event)
        await addTerritory(name, salesRep, serviceTech, states)
        return { body: '', message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});
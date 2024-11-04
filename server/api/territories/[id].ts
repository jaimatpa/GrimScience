import { updateTerritory, deleteTerritory, territoryExistByID } from '~/server/controller/territories';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    const idExist = await territoryExistByID(id);

    switch (method.toUpperCase()) {
      case 'PUT':
        if (idExist) {
          const {name, salesRep, serviceTech, states} = await readBody(event)
          const updatedID = await updateTerritory(id, name, salesRep, serviceTech, states)
          return { body: { updatedID }, message: 'Job updated successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The Job does not exist' }
        }
      case 'DELETE':
        if (idExist) {
          const deletedID = await deleteTerritory(id);
          return { body: { deletedID }, message: 'Territory deleted successfully' }
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
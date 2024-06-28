import {  OrganizationExistByID, deleteOrganization, getOrganizationDetail, updateOrganization } from '~/server/controller/employees';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    const idExist = await OrganizationExistByID(id);
    
    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){
          const detail = await getOrganizationDetail(id)
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The organization does not exist' }
        }
      case 'PUT':
        if (idExist) {
          const reqData = await readBody(event);
          const updatedID = await updateOrganization(id, reqData)
          return { body: { updatedID }, message: 'Organization updated successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The organization does not exist' }
        }
      case 'DELETE':
        if (idExist) {
          const deletedID = await deleteOrganization(id);
          return { body: { deletedID }, message: 'Organization deleted successfully' }
        } else {
          setResponseStatus(event, 404);
          return { error: 'The organization does not exist' }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
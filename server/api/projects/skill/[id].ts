import { customerExistByID, deleteCustomer, getCustomerDetail, updateCustomer } from '~/server/controller/customers';
import { deleteSkill, getSkillDetail, skillExistByID, updateSkill } from '~/server/controller/projects/projects';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;
console.log('id.....',id);
console.log("method is",method);
console.log('Type of id:', typeof id);

    const idExist = await skillExistByID(id);
console.log("exist is",idExist)

    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){
          console.log('idididid',id);
          
          const detail = await getSkillDetail(id)
          console.log('detaildetaildetail',detail);
          
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The customer does not exist' }
        }
      case 'PUT':
        if (idExist) {
          const reqData = await readBody(event);
          const updatedID = await updateSkill(id, reqData)
          return { body: { updatedID }, message: 'Skill updated successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The customer does not exist' }
        }
      case 'DELETE':
          console.log("is exist coming",idExist);
        if (idExist) {
          const deletedID = await deleteSkill(id);
          return { body: { deletedID }, message: 'Skill deleted successfully' }
        } else {
          setResponseStatus(event, 404);
          return { error: 'The customer does not exist' }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
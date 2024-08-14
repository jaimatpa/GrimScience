import { EmployeeExistByID, deleteEmployee, getEmployeeDetail, updateEmployee } from '~/server/controller/employees';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    const idExist = await EmployeeExistByID(id);
    
    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){
          const detail = await getEmployeeDetail(id)
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The Employee does not exist' }
        }
      case 'PUT':
        if (idExist) {
          const reqData = await readBody(event);
          const updatedID = await updateEmployee(id, reqData)
          return { body: { updatedID }, message: 'Employee updated successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The employee does not exist' }
        }
      case 'DELETE':
        if (idExist) {
          const deletedID = await deleteEmployee(id);
          return { body: { deletedID }, message: 'Employee deleted successfully' }
        } else {
          setResponseStatus(event, 404);
          return { error: 'The employee does not exist' }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
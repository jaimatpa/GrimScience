import { customerExistByID, deleteCustomer, getCustomerDetail, updateCustomer } from '~/server/controller/customers';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;
console.log('id.....',id);

    const idExist = await customerExistByID(id);
    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){
          console.log('idididid',id);
          
          const detail = await getCustomerDetail(id)
          console.log('detaildetaildetail',detail);
          
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The customer does not exist' }
        }
      case 'PUT':
        if (idExist) {
          const reqData = await readBody(event);
          const updatedID = await updateCustomer(id, reqData)
          return { body: { updatedID }, message: 'Customer updated successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The customer does not exist' }
        }
      case 'DELETE':
        if (idExist) {
          const deletedID = await deleteCustomer(id);
          return { body: { deletedID }, message: 'Customer deleted successfully' }
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
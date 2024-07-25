import {  customerMessageByID, deleteMessage, getMessageDetail, updateMessage } from '~/server/controller/customers';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    const idExist = await customerMessageByID(id);
    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){          
          const detail = await getMessageDetail(id)
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The Message does not exist' }
        }
        case 'PUT':
        if (idExist) {
          const reqData = await readBody(event);
          const updatedID = await updateMessage(id, reqData)
          return { body: { updatedID }, message: 'Message updated successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The customer does not exist' }
        }
        case 'DELETE':
        if (idExist) {
          const deletedID = await deleteMessage(id);
          return { body: { deletedID }, message: 'Message deleted successfully' }
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
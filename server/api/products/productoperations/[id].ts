import { productExistByID,operationExistByID, getProductOperations, editProductOperation, deleteProductOperation } from '~/server/controller/products';

export default eventHandler(async (event) => {
  try {
    
    const method = event._method;

    switch(method.toUpperCase()){
      case 'GET':
        const pid = event.context.params.id;
        const pidExist = await productExistByID(pid);
        if (pidExist){     
          const detail = await getProductOperations(pid)
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The product does not exist' }
        }
      case 'PUT':
        const opid = event.context.params.id;
        const opidExist = await operationExistByID(opid);
        if (opidExist) {
          const id = event.context.params.id;
          const { data } = await readBody<{ data:{} }>(event)
          const updatedID = await editProductOperation(data ,id)
          return { body: { updatedID }, message: 'Operation updated successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The operation does not exist' }
        }
      case 'DELETE':
        const oid = event.context.params.id;
        const oidExist = await operationExistByID(oid);
        if (oidExist) {
          const deletedID = await deleteProductOperation(oid);
          return { body: { deletedID }, message: 'Operation deleted successfully' }
        } else {
          setResponseStatus(event, 404);
          return { error: 'The operation does not exist' }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
import {  operationExistByID, getMfgOperations, editMfgOperation, deleteMfgOperation } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    
    const method = event._method;

    switch(method.toUpperCase()){
      case 'GET':
        const instanceId = event.context.params.id;
        const detail = await getMfgOperations(instanceId)
        return { body: detail, message: '' };
      case 'PUT':
        const opid = event.context.params.id;
        const opidExist = await operationExistByID(opid);
        if (opidExist) {
          const id = event.context.params.id;
          const { data } = await readBody<{ data:{} }>(event)
          const updatedID = await editMfgOperation(data ,id)
          return { body: { updatedID }, message: 'Operation updated successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The operation does not exist' }
        }
      case 'DELETE':
        const oid = event.context.params.id;
        const oidExist = await operationExistByID(oid);
        if (oidExist) {
          const deletedID = await deleteMfgOperation(oid);
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

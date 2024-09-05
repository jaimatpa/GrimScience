import { EmployeeExistByID, deleteEmployee, getEmployeeDetail, updateEmployee } from '~/server/controller/employees';
import { createParts, deleteParts, getPartsDetail, PartsExistByID, updateParts, updatePartsByRevisionID } from '~/server/controller/materials/Parts';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;

    const method = event._method;
    const query = getQuery(event);
    
 
console.log("method is",method);
   
    
    switch(method.toUpperCase()){
      case 'GET':
        const idExist = await PartsExistByID(id);
        if (idExist){
          const detail = await getPartsDetail(id)
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The Employee does not exist' }
        }
        case 'PUT':
          // Check if instanceIdForRevision is provided in the query
          const { instanceIdForRevision } = query;
  
          if (instanceIdForRevision) {
            console.log("instace id is in",instanceIdForRevision);
            // Check if part exists by instanceIdForRevision
            const partByRevisionExist = await PartsExistByID(id);
            if (partByRevisionExist) {
              const detail1 = await getPartsDetail(id);
              console.log("detais is",detail1);
              const updatedRevisionID = await updatePartsByRevisionID( detail1);
              return { body: { updatedRevisionID }, message: 'Part updated by revision ID successfully' };
            } else {
              setResponseStatus(event, 404);
              return { error: 'The part with the given revision ID does not exist' };
            }
          } else {
            // Continue with the original update logic if no revision ID
            const idExist1 = await PartsExistByID(id);
            if (idExist1) {
              const reqData = await readBody(event);
              const updatedID = await updateParts(id, reqData);
              return { body: { updatedID }, message: 'Part updated successfully' };
            } else {
              setResponseStatus(event, 404);
              return { error: 'The part does not exist' };
            }
          }
  
  
      case 'DELETE':
        const idExist2 = await PartsExistByID(id);
        if (idExist2) {
          const deletedID = await deleteParts(id);
          return { body: { deletedID }, message: 'parts deleted successfully' }
        } else {
          setResponseStatus(event, 404);
          return { error: 'The employee does not exist' }
        }

        case 'POST':
 // Read the body data from the POST request
 const reqData = await readBody(event);
        
 // Pass the body data to createParts function
 const createdId = await createParts(reqData);
 
 return { body: { createdId }, message: 'Part created successfully' };
   


      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});



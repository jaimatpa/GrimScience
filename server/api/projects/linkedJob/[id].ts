import { getMaxJobId, insertLinkedJob} from '~/server/controller/projects/projects';


export default eventHandler(async (event) => {
  try {
    const method = event._method;
    console.log('Method:', method);
    const id = event.context.params.id;
    // Parse JSON body
    const body = await readBody(event);
    
    let maxId;

if(body.selectedCustomer){
  maxId=body.selectedCustomer;
}
else{
  maxId = await getMaxJobId();
  
  console.log('id is:', maxId);
}
 
    if (method.toUpperCase() === 'POST') {
      const result = await insertLinkedJob(body.jobData,maxId); // Pass the whole body

      if (result.success) {
        console.log('Success:', result);
        return { body: result, message: 'Data inserted successfully' };
      } else {
        setResponseStatus(event, 404);
        return { error: 'Data insertion failed' };
      }
    } else {
      setResponseStatus(event, 405); // Method Not Allowed
      return { error: 'Method not allowed' };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    setResponseStatus(event, 500); // Internal Server Error
    return { error: 'Internal Server Error' };
  }
});

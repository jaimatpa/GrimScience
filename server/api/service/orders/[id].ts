import { createComplaint, getComplaintDetail, updateComplaint, getComplainNo,getSerialByCustomer } from '~/server/controller/service';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id
    const method = event._method;
    switch(method.toUpperCase()){
      case 'GET':
        const detail = await getComplaintDetail(id);
        return { body: detail, message: '' }
      case 'PUT':
        const reqData = await readBody(event)
        const updateResult = await updateComplaint(id, reqData)
        return { body: updateResult, message: 'Order updated successfully' }
      case 'POST':
        // get new complain number 
        const newCompId =  await getComplainNo();
        const createReqData = await readBody(event)
         // get serialId from serial number
        const getSerialRes = await getSerialByCustomer(createReqData?.CustomerID)
         // Create complain func
        const createdResult = await createComplaint(createReqData,newCompId,getSerialRes)
        return { body: createdResult, message: 'Order created successfully' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
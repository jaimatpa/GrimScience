import { productExistByID, bulkInactiveProduct} from '~/server/controller/products';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;
    const reqData = await readBody(event);
    const data = reqData.data._value
    let allProductExist = true
    data.forEach(async (uniqueID) => {
      const idExist = await productExistByID(uniqueID);
      if(!idExist){
        allProductExist = false
      }
    })
    
    switch(method.toUpperCase()){
      case 'PUT':
        if (allProductExist) {
          const updatedID = await bulkInactiveProduct(data)
          return { body: { updatedID }, message: 'All product inactivated successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'All products does not exist' }
        }

      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
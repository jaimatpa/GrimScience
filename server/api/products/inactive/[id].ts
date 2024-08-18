import { productExistByID, inactiveProduct} from '~/server/controller/products';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    const idExist = await productExistByID(id);
    switch(method.toUpperCase()){
      case 'PUT':
        if (idExist) {
          const reqData = await readBody(event);
          const updatedID = await inactiveProduct(id, reqData)
          return { body: { updatedID }, message: 'Product inactivated successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The product does not exist' }
        }

      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
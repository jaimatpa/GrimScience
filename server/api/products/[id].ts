import { productExistByID, deleteProduct, getProductDetail, updateProduct } from '~/server/controller/products';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    const idExist = await productExistByID(id);
    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){     
          const detail = await getProductDetail(id)
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The product does not exist' }
        }
      case 'PUT':
        if (idExist) {
          const reqData = await readBody(event);
          const updatedID = await updateProduct(id, reqData)
          return { body: { updatedID }, message: 'Product updated successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The product does not exist' }
        }
      case 'DELETE':
        if (idExist) {
          const deletedID = await deleteProduct(id);
          return { body: { deletedID }, message: 'Product deleted successfully' }
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
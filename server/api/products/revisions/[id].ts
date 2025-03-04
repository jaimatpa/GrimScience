import { productExistByID, getRevisions, revisionProduct} from '~/server/controller/products';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    const idExist = await productExistByID(id);
    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){     
          const detail = await getRevisions(id)
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The product does not exist' }
        }
      case 'PUT':
        if (idExist) {
          const { data ,files} = await readBody<{ files: File[], data:{} }>(event)
          const updatedID = await revisionProduct(data,files)
          return { body: { updatedID }, message: 'Product revised successfully' };
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
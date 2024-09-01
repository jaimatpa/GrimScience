import { getProducts, createProduct } from '~/server/controller/products';

export default eventHandler(async (event) => {
  try {
    const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event);
    const method = event._method;
    switch(method.toUpperCase()){
      case 'GET':
        const list = await getProducts(page, pageSize, sortBy, sortOrder, filterParams);
        return { body: list, message: '' }
      case 'POST':
        const { data ,files} = await readBody<{ files: File[], data:{} }>(event)
        const newProduct = await createProduct(data,files)
        return { body: { newProduct }, message: 'New product created successfully!'}
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
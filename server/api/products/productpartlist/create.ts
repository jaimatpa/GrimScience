import { createProductOperation } from '~/server/controller/products';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    switch(method.toUpperCase()){
      case 'POST':
        const { data } = await readBody<{ data:{} }>(event)
        const newCustomer = await createProductOperation(data)
        return { body: { newCustomer }, message: 'New operation created successfully!'}
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
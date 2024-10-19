import { createMfgOperation } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    switch(method.toUpperCase()){
      case 'POST':
        const { data } = await readBody<{ data:{} }>(event)
        const newOperation = await createMfgOperation(data)
        return { body: { newOperation }, message: 'New operation created successfully!'}
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});

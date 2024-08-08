import { getMessages, createMessage } from '~/server/controller/customers';

export default eventHandler(async (event) => {
  try {
    const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event);
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'GET':
        const list = await getMessages(page, pageSize, sortBy, sortOrder, filterParams);
        return { body: list, message: '' }
        case 'POST':
          const data = await readBody(event)
          const newMessage = await createMessage(data)
          return { body: { newMessage }, message: 'New Message created successfully!'}
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
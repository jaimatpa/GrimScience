import { getQuoteNumber, createOrderOnNoProps } from '~/server/controller/quotes/quotes'

export default eventHandler(async (event) => {
    try {
      const method = event._method;
  
      switch (method.toUpperCase()) {
        case 'GET':
          const quoteData = await getQuoteNumber();
          return { 
            body: quoteData, 
            message: 'Quote number retrieved successfully' 
          };
  
        case 'POST':
          const data = await readBody(event);

          const createdOrder = await createOrderOnNoProps(data);
          
          return { 
            body: createdOrder, 
            message: 'Order created successfully' 
          };
  
        default:
          setResponseStatus(event, 405);
          return { error: 'Method Not Allowed' };
      }
    } catch (error) {
      setResponseStatus(event, 500);
      return { error: `Error: ${error.message}` };
    }
  });

  

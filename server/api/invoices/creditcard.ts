import { processCreditCard } from '~/server/controller/invoices';

export default eventHandler(async (event) => {
  try {
    const { cardnumber, expirationmonth, expirationyear, cvc, ...orderInfo } = getQuery(event);
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'POST':
        const data = await readBody(event)
        const { merchantinfo, orderinfo } = data
        const transactionResult: any = await processCreditCard(merchantinfo, orderinfo)
        if(transactionResult.statusCode === 200) {
          return { body: transactionResult.transactionID, message: transactionResult.message }
        } else {
          setResponseStatus(event, transactionResult.statusCode)
          return { error: transactionResult.message }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
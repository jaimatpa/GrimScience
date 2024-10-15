import { getBegSerial } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const { model } = getQuery(event);

    const method = event._method;
    switch(method.toUpperCase()){
      case 'GET':
        const { recJOainstanceID, recJOaBegSerial } = await getBegSerial(model)
        return { body: { recJOainstanceID, recJOaBegSerial }, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});

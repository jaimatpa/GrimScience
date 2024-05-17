export default eventHandler(async (event) => {
  try {
    const tblName = event.context.params.tblName;
    const id = event.context.params.id;
    const method = event._method;
  
    switch(method.toUpperCase()){
      case 'GET':
        break;
      case 'PUT':
        break;
      case 'DELETE':
        break;
      default:
        break;
    }
  } catch {

  }
})
import { getCapas } from "~/server/controller/engineering/Capa";

export default eventHandler(async (event) => {
  try {
    const method = event._method
    const { ...params } = getQuery(event)

    switch (method) {
      case 'GET':
        const capas = await getCapas(params);
        return { body: capas, message: "" };
      // case 'POST':
      //   const data = await readBody(event)
      //   // console.log('API got hit', data)
      //   const investigation = await createInvestigation(data)
      //   return { body: investigation, message: investigation.message, messageType: investigation.messageType }
      // case 'PUT':
      //   const updatedData = await readBody(event)
      //   // console.log('API got hit', data)
      //   const updatedInvestigation = await updateInvestigation(updatedData)
      //   return { body: updatedInvestigation, message: updatedInvestigation.message, messageType: updatedInvestigation.messageType }
      default:
        setResponseStatus(event, 405)
        return { error: 'Method Not Allowed' }
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`)
  }
})

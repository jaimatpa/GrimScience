import { getInvestigations, createInvestigation, updateInvestigation } from '~/server/controller/engineering'

export default eventHandler(async (event) => {
  try {
    const method = event._method
    const { ...params } = getQuery(event)

    switch (method) {
      case 'GET':
        const investigations = await getInvestigations(params)
        return { body: investigations, message: '' }
      case 'POST':
        const data = await readBody(event)
        // console.log('API got hit', data)
        const investigation = await createInvestigation(data)
        return { body: investigation, message: investigation.message, messageType: investigation.messageType }
      case 'PUT':
        const updatedData = await readBody(event)
        // console.log('API got hit', data)
        const updatedInvestigation = await updateInvestigation(updatedData)
        return { body: updatedInvestigation, message: updatedInvestigation.message, messageType: updatedInvestigation.messageType }
      default:
        setResponseStatus(event, 405)
        return { error: 'Method Not Allowed' }
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`)
  }
})

import { getInvestigationCAPAs, removeInvestigationCAPA, createInvestigationCAPA } from '~/server/controller/engineering'

export default eventHandler(async (event) => {
  try {
    const method = event._method
    const { ...params } = getQuery(event)

    switch (method) {
      case 'GET':
        const capas = await getInvestigationCAPAs(params)
        return { body: capas, message: '' }
      case 'POST':
        console.log('params', params)
        const newCAPA = await createInvestigationCAPA(params)
        return { body: newCAPA, message: 'CAPA created successfully' }
      case 'DELETE':
        const result = await removeInvestigationCAPA(params)
        return { body: result, message: '' }
      default:
        setResponseStatus(event, 405)
        return { error: 'Method Not Allowed' }
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`)
  }
})

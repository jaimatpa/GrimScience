import { getCapas, createCapa, updateCapa } from "~/server/controller/engineering/Capa";

export default eventHandler(async (event) => {
  try {
    const method = event._method
    const { ...params } = getQuery(event)

    switch (method) {
      case 'GET':
        const capas = await getCapas(params);
        return { body: capas, message: "" };
      case 'POST':
        const data = await readBody(event)
        // console.log('API got hit', data)
        const capa = await createCapa(data);
        return { body: capa, message: capa.message, messageType: capa.messageType };
      case 'PUT':
        const updatedData = await readBody(event)
        // console.log('API got hit', data)
        const updatedCapa = await updateCapa(updatedData);
        return { body: updatedCapa, message: updatedCapa.message, messageType: updatedCapa.messageType };
      default:
        setResponseStatus(event, 405)
        return { error: 'Method Not Allowed' }
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`)
  }
})

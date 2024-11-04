import { eventHandler } from 'h3'
import { removeOrderDetail } from '~/server/controller/quotes/quotes'

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    const result = await removeOrderDetail(body.orderDetailId)

    return {
      statusCode: 200,
      body: {
        message: "Order detail removed successfully",
        result
      }
    }
  } catch (error) {
    console.error("Error removing order detail:", error)
    return {
      statusCode: 500,
      body: {
        message: error.message
      }
    }
  }
})
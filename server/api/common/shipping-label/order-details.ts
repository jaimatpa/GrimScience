import { QueryTypes } from "sequelize"
import sequelize from "~/server/utils/databse"

export default defineEventHandler(async (event) => {
    try {
        const { orderId } = getQuery(event)

        if (!orderId) {
            throw createError({
                statusCode: 400,
                message: 'Order ID is required'
            })
        }

        const result = await sequelize.query(`
        SELECT 
          UniqueID,
          type,
          name,
          quantity,
          price,
          serial,
          shipping
        FROM tblOrderDetail
        WHERE orderid = :orderId
        ORDER BY type ASC
      `, {
            replacements: { orderId },
            type: QueryTypes.SELECT,
            raw: true,
        })
        return {
            body: result,
            message: "success"
        }

    } catch (error) {
        console.error('Order details API error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch order details'
        })
    }
})
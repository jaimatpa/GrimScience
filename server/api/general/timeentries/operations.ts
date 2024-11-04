import { QueryTypes } from "sequelize"
import sequelize from "~/server/utils/databse"

interface OperationQuery {
    jobId: string
    workCenter: string
    instanceId: string
}

export default defineEventHandler(async (event) => {
    const method = event._method

    switch (method.toUpperCase()) {
        case "GET":
            try {
                const { jobId, workCenter, instanceId } = getQuery(event) as OperationQuery

                if (!jobId || !workCenter || !instanceId) {
                    throw createError({
                        statusCode: 400,
                        message: 'jobId, workCenter, and instanceId are required'
                    })
                }

                const query = `
                    SELECT uniqueID, number, Operation
                    FROM tblJobOperations 
                    WHERE jobID = :jobId
                    AND WorkCenter = :workCenter
                    AND instanceID = :instanceId
                    AND (verifiedby IS NULL OR verifiedby = '')
                    ORDER BY number
                `

                const result = await sequelize.query(query, {
                    replacements: {
                        jobId,
                        workCenter,
                        instanceId
                    },
                    type: QueryTypes.SELECT
                })

                return {
                    statusCode: 200,
                    body: result
                }
            } catch (error) {
                console.error('Operations fetch error:', error)
                throw createError({
                    statusCode: error.statusCode || 500,
                    message: error.message || 'Failed to fetch operations'
                })
            }

        default:
            throw createError({
                statusCode: 405,
                message: 'Method Not Allowed'
            })
    }
})
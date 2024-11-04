import { QueryTypes } from "sequelize"
import sequelize from "~/server/utils/databse"

export default defineEventHandler(async (event) => {
    const method = event._method
    const { user: employee } = parseCookies(event)
    const employeeId = JSON.parse(employee).UniqueID

    switch (method.toUpperCase()) {
        case "GET":
            try {
                const employeeQuery = `
                    SELECT workcenters
                    FROM tblEmployee 
                    WHERE uniqueID = :employeeId
                `
                const employeeResult = await sequelize.query(employeeQuery, {
                    type: QueryTypes.SELECT,
                    replacements: { employeeId }
                })

                if (!employeeResult.length || !employeeResult[0].workcenters) {
                    return {
                        statusCode: 200,
                        body: []
                    }
                }

                // Convert comma-separated string to array of IDs
                const workcenterIds = employeeResult[0].workcenters
                    .split(',')
                    .map(id => id.trim())
                    .filter(id => id)

                const query = `
                    SELECT 
                        uniqueID, 
                        NUMBER, 
                        Name, 
                        TimeEntryWithoutJob, 
                        paid 
                    FROM tblWorkCenters
                    WHERE uniqueID IN (:workcenterIds)
                    ORDER BY Number
                `

                const result = await sequelize.query(query, {
                    type: QueryTypes.SELECT,
                    replacements: { workcenterIds }
                })

                return {
                    statusCode: 200,
                    body: result
                }
            } catch (error) {
                console.error('WorkCenter fetch error:', error)
                throw createError({
                    statusCode: error.statusCode || 500,
                    message: error.message || 'Failed to fetch work centers'
                })
            }

        default:
            throw createError({
                statusCode: 405,
                message: 'Method Not Allowed'
            })
    }
})
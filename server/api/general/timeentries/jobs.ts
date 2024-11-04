import { QueryTypes } from "sequelize"
import sequelize from "~/server/utils/databse"

interface JobQuery {
    workCenter?: string
    date?: string
    instanceId?: string
    jobNumber?: string
}

interface Job {
    uniqueID: number
    NUMBER: string
    instanceID: number
    part?: string
    model?: string
    dateClosed?: string
}

export default defineEventHandler(async (event) => {
    const method = event._method

    switch (method.toUpperCase()) {
        case "GET":
            try {
                const query = getQuery(event) as JobQuery

                // Get jobs by work center and date
                if (query.workCenter && query.date) {
                    const sqlQuery = `
                        SELECT DISTINCT j.uniqueID, j.NUMBER, j.instanceID, j.part, j.model
                        FROM tblJobs j
                        INNER JOIN tblPlan p ON j.InstanceID = p.instanceid
                        WHERE dateClosed = ''
                        AND p.WorkCenter = :workCenter
                        AND CAST(productionDate as datetime) <= :date
                        ORDER BY j.Number
                    `

                    const jobs = await sequelize.query(sqlQuery, {
                        replacements: {
                            workCenter: query.workCenter,
                            date: query.date
                        },
                        type: QueryTypes.SELECT
                    })

                    return {
                        statusCode: 200,
                        body: jobs
                    }
                }

                // Get job instance details
                if (query.jobNumber) {
                    const sqlQuery = `
                        SELECT uniqueID, instanceID, part + model as description
                        FROM tblJobs
                        WHERE Number = :jobNumber
                    `

                    const jobInstance = await sequelize.query(sqlQuery, {
                        replacements: {
                            jobNumber: query.jobNumber
                        },
                        type: QueryTypes.SELECT
                    })

                    return {
                        statusCode: 200,
                        body: jobInstance[0] || null
                    }
                }

                throw createError({
                    statusCode: 400,
                    message: 'Invalid query parameters'
                })
            } catch (error) {
                console.error('Jobs fetch error:', error)
                throw createError({
                    statusCode: error.statusCode || 500,
                    message: error.message || 'Failed to fetch jobs'
                })
            }

        case "POST":
            try {
                const body = await readBody(event) as Job

                if (!body.NUMBER) {
                    throw createError({
                        statusCode: 400,
                        message: 'Job number is required'
                    })
                }

                const sqlQuery = `
                    INSERT INTO tblJobs (NUMBER, instanceID, part, model, dateClosed)
                    VALUES (:jobNumber, :instanceId, :part, :model, :dateClosed)
                `

                await sequelize.query(sqlQuery, {
                    replacements: {
                        jobNumber: body.NUMBER,
                        instanceId: body.instanceID,
                        part: body.part || '',
                        model: body.model || '',
                        dateClosed: body.dateClosed || ''
                    },
                    type: QueryTypes.INSERT
                })

                return {
                    statusCode: 201,
                    message: 'Job created successfully'
                }
            } catch (error) {
                console.error('Job creation error:', error)
                throw createError({
                    statusCode: error.statusCode || 500,
                    message: error.message || 'Failed to create job'
                })
            }

        case "PUT":
            try {
                const body = await readBody(event) as Job

                if (!body.uniqueID) {
                    throw createError({
                        statusCode: 400,
                        message: 'Job ID is required'
                    })
                }

                const sqlQuery = `
                    UPDATE tblJobs 
                    SET NUMBER = :jobNumber,
                        instanceID = :instanceId,
                        part = :part,
                        model = :model,
                        dateClosed = :dateClosed
                    WHERE uniqueID = :jobId
                `

                await sequelize.query(sqlQuery, {
                    replacements: {
                        jobId: body.uniqueID,
                        jobNumber: body.NUMBER,
                        instanceId: body.instanceID,
                        part: body.part || '',
                        model: body.model || '',
                        dateClosed: body.dateClosed || ''
                    },
                    type: QueryTypes.UPDATE
                })

                return {
                    statusCode: 200,
                    message: 'Job updated successfully'
                }
            } catch (error) {
                console.error('Job update error:', error)
                throw createError({
                    statusCode: error.statusCode || 500,
                    message: error.message || 'Failed to update job'
                })
            }

        case "DELETE":
            try {
                const { id } = getQuery(event)

                if (!id) {
                    throw createError({
                        statusCode: 400,
                        message: 'Job ID is required'
                    })
                }

                const sqlQuery = `
                    DELETE FROM tblJobs
                    WHERE uniqueID = :jobId
                `

                await sequelize.query(sqlQuery, {
                    replacements: {
                        jobId: id
                    },
                    type: QueryTypes.DELETE
                })

                return {
                    statusCode: 200,
                    message: 'Job deleted successfully'
                }
            } catch (error) {
                console.error('Job deletion error:', error)
                throw createError({
                    statusCode: error.statusCode || 500,
                    message: error.message || 'Failed to delete job'
                })
            }

        default:
            throw createError({
                statusCode: 405,
                message: 'Method Not Allowed'
            })
    }
})
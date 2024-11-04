import { QueryTypes } from "sequelize"
import sequelize from "~/server/utils/databse"

interface TimeEntry {
    startTime: string
    workCenterID: number
    jobID?: number | null
    operationID?: number | null
}

export default defineEventHandler(async (event) => {
    const method = event._method
    const { user: employee } = parseCookies(event)
    const employeeId = JSON.parse(employee).UniqueID
    switch (method.toUpperCase()) {
        case "GET":
            try {
                const { date, weekSunday } = getQuery(event)
                if (!date && !weekSunday) {
                    throw createError({
                        statusCode: 400,
                        message: 'At least one of date or weekSunday is required'
                    });
                }

                let query;
                if (weekSunday) {
                    // Calculate next Sunday directly
                    const currentSunday = new Date(weekSunday);
                    const nextSunday = new Date(currentSunday);
                    nextSunday.setDate(currentSunday.getDate() + 7);

                    // Format dates for SQL Server
                    const formattedCurrentSunday = currentSunday.toISOString().split('T')[0];
                    const formattedNextSunday = nextSunday.toISOString().split('T')[0];

                    // Modified query with correct date range
                    query = `
                        SELECT 
                            CONVERT(date, StartTime) as startTime,
                            DATENAME(WEEKDAY, CONVERT(date, StartTime)) as dayOfWeek,
                            SUM(tblOperationHoursWorked.hours) as hours
                        FROM tblOperationHoursWorked 
                        LEFT JOIN tblEmployee ON tblOperationHoursWorked.EmployeeID = tblEmployee.UniqueID 
                        LEFT JOIN tblWorkCenters ON tblWorkCenters.uniqueID = tblOperationHoursWorked.WorkCenterID 
                        LEFT JOIN tblJobs ON tblJobs.uniqueID = tblOperationHoursWorked.JobID 
                        LEFT JOIN tblJobOperations ON tblJobOperations.UniqueID = tblOperationHoursWorked.OperationID 
                        WHERE EmployeeID = :employeeId 
                        AND CONVERT(date, StartTime) >= :currentSunday
                        AND CONVERT(date, StartTime) < :nextSunday
                        AND paid = 1
                        GROUP BY CONVERT(date, StartTime), DATENAME(WEEKDAY, CONVERT(date, StartTime))
                        ORDER BY CONVERT(date, StartTime) ASC
                    `;

                    const result = await sequelize.query(query, {
                        replacements: {
                            employeeId,
                            currentSunday: formattedCurrentSunday,
                            nextSunday: formattedNextSunday
                        },
                        type: QueryTypes.SELECT
                    });

                    // Fetch verification status
                    const verifyQuery = `
                        SELECT VerifyBy, VerifyDate 
                        FROM tblTimeVerify 
                        WHERE WeekSunday = :weekSunday 
                        AND EmployeeID = :employeeId
                    `;
                    const verifyResult = await sequelize.query(verifyQuery, {
                        replacements: { weekSunday, employeeId },
                        type: QueryTypes.SELECT
                    });

                    return {
                        statusCode: 200,
                        body: {
                            timeEntries: result.map(entry => ({
                                startTime: entry.startTime,
                                dayOfWeek: entry.dayOfWeek,
                                hours: Number(entry.hours || 0)
                            })),
                            verification: verifyResult[0] || null,
                            totalHours: result.reduce((sum, entry) => sum + Number(entry.hours || 0), 0),
                            dateRange: {
                                start: formattedCurrentSunday,
                                end: formattedNextSunday
                            }
                        }
                    }
                } else {
                    query = `
                        SELECT 
                            tblOperationHoursWorked.uniqueID AS UID,
                            EmployeeID, 
                            StartTime,
                            ('#' + CAST(tblWorkCenters.Number AS varchar(16)) + ' ' + tblWorkCenters.NAME) AS WorkCenter,
                            tblJobs.NUMBER AS Job,
                            ('#' + CAST(tblJobOperations.number AS varchar(16)) + ' ' + tblJobOperations.Operation) AS Operation,
                            tblOperationHoursWorked.hours,
                            paid
                        FROM tblOperationHoursWorked 
                        LEFT JOIN tblEmployee ON tblOperationHoursWorked.EmployeeID = tblEmployee.UniqueID 
                        LEFT JOIN tblWorkCenters ON tblWorkCenters.uniqueID = tblOperationHoursWorked.WorkCenterID 
                        LEFT JOIN tblJobs ON tblJobs.uniqueID = tblOperationHoursWorked.JobID 
                        LEFT JOIN tblJobOperations ON tblJobOperations.UniqueID = tblOperationHoursWorked.OperationID 
                        WHERE EmployeeID = :employeeId 
                        AND CONVERT(date, StartTime) = :date
                        ORDER BY StartTime ASC
                    `;

                    const result = await sequelize.query(query, {
                        replacements: { date, employeeId },
                        type: QueryTypes.SELECT
                    });

                    return {
                        statusCode: 200,
                        body: result
                    }
                }
            } catch (error) {
                console.error('Time entries fetch error:', error)
                throw createError({
                    statusCode: error.statusCode || 500,
                    message: error.message || 'Failed to fetch time entries'
                })
            }

        case "POST":
            try {
                const body = await readBody(event) as TimeEntry

                const transaction = await sequelize.transaction()

                try {
                    let existingEntry = null
                    if (body.id) {
                        const query = `
                            SELECT * FROM tblOperationHoursWorked 
                            WHERE uniqueID = :id AND EmployeeID = :employeeId
                        `
                        const [entry] = await sequelize.query(query, {
                            type: QueryTypes.SELECT,
                            replacements: { id: body.id, employeeId },
                            transaction
                        })
                        existingEntry = entry
                    }

                    // Perform validations like in VB.NET
                    if (!body.workCenterName || !body.startTime) {
                        throw createError({
                            statusCode: 400,
                            message: 'Required fields missing'
                        })
                    }

                    // Get WorkCenter ID and check requirements
                    const workCenterQuery = `
                SELECT uniqueID, TimeEntryWithoutJob 
                FROM tblWorkCenters 
                WHERE '#' + Number + ' ' + Name = :workCenterName
            `
                    const [workCenter] = await sequelize.query(workCenterQuery, {
                        type: QueryTypes.SELECT,
                        replacements: { workCenterName: body.workCenterName },
                        transaction
                    })

                    if (!workCenter) {
                        throw createError({
                            statusCode: 400,
                            message: 'Invalid work center'
                        })
                    }

                    if (!workCenter.TimeEntryWithoutJob && !body.jobNumber) {
                        throw createError({
                            statusCode: 400,
                            message: 'The work center you selected requires a job to submit a time entry'
                        })
                    }

                    // Build the insert/update data
                    const data = {
                        StartTime: body.startTime,
                        EmployeeID: employeeId,
                        WorkCenterID: workCenter.uniqueID,
                        JobID: null,
                        OperationID: null
                    }

                    // Get Job ID if provided
                    if (body.jobNumber) {
                        const [job] = await sequelize.query(
                            `SELECT uniqueID FROM tblJobs WHERE NUMBER = :jobNumber`,
                            {
                                type: QueryTypes.SELECT,
                                replacements: { jobNumber: body.jobNumber },
                                transaction
                            }
                        )
                        if (job) {
                            data.JobID = job.uniqueID

                            // Operation is required if job is provided
                            if (!body.operationName) {
                                throw createError({
                                    statusCode: 400,
                                    message: 'A job requires you to select an operation to submit a time entry'
                                })
                            }

                            // Get Operation ID
                            const [operation] = await sequelize.query(
                                `SELECT uniqueID FROM tblJobOperations 
                         WHERE jobID = :jobId 
                         AND '#' + CAST(number as nvarchar(16)) + ' ' + Operation = :operationName`,
                                {
                                    type: QueryTypes.SELECT,
                                    replacements: {
                                        jobId: job.uniqueID,
                                        operationName: body.operationName
                                    },
                                    transaction
                                }
                            )
                            if (operation) {
                                data.OperationID = operation.uniqueID
                            }
                        }
                    }

                    // Perform insert or update
                    if (existingEntry) {
                        await sequelize.query(
                            `UPDATE tblOperationHoursWorked 
                     SET StartTime = :startTime,
                         WorkCenterID = :workCenterId,
                         JobID = :jobId,
                         OperationID = :operationId
                     WHERE uniqueID = :id AND EmployeeID = :employeeId`,
                            {
                                replacements: {
                                    id: body.id,
                                    startTime: data.StartTime,
                                    workCenterId: data.WorkCenterID,
                                    jobId: data.JobID,
                                    operationId: data.OperationID,
                                    employeeId
                                },
                                type: QueryTypes.UPDATE,
                                transaction
                            }
                        )
                    } else {
                        await sequelize.query(
                            `INSERT INTO tblOperationHoursWorked 
                     (StartTime, EmployeeID, WorkCenterID, JobID, OperationID)
                     VALUES (:startTime, :employeeId, :workCenterId, :jobId, :operationId)`,
                            {
                                replacements: {
                                    startTime: data.StartTime,
                                    employeeId,
                                    workCenterId: data.WorkCenterID,
                                    jobId: data.JobID,
                                    operationId: data.OperationID
                                },
                                type: QueryTypes.INSERT,
                                transaction
                            }
                        )
                    }

                    // Update hours calculation
                    await sequelize.query(
                        `WITH OrderedEntries AS (
                    SELECT 
                        uniqueID,
                        StartTime,
                        LAG(StartTime) OVER (ORDER BY StartTime) as PrevTime
                    FROM tblOperationHoursWorked
                    WHERE EmployeeID = :employeeId
                    AND CONVERT(date, StartTime) = CONVERT(date, :startTime)
                )
                UPDATE tblOperationHoursWorked
                SET hours = CASE 
                    WHEN oe.PrevTime IS NULL THEN 0
                    ELSE DATEDIFF(MINUTE, oe.PrevTime, oe.StartTime) / 60.0
                END
                FROM tblOperationHoursWorked t
                JOIN OrderedEntries oe ON t.uniqueID = oe.uniqueID`,
                        {
                            replacements: {
                                employeeId,
                                startTime: data.StartTime
                            },
                            type: QueryTypes.UPDATE,
                            transaction
                        }
                    )

                    await transaction.commit()

                    return {
                        message: existingEntry ? 'Time entry updated' : 'Time entry created'
                    }

                } catch (error) {
                    await transaction.rollback()
                    throw error
                }
            } catch (error) {
                throw createError({
                    statusCode: error.statusCode || 500,
                    message: error.message || 'Failed to process time entry'
                })
            }
        case "DELETE":
            try {
                const { id } = getQuery(event)

                if (!id) {
                    throw createError({
                        statusCode: 400,
                        message: 'ID is required for deletion'
                    })
                }

                const query = `
                    DELETE FROM tblOperationHoursWorked 
                    WHERE uniqueID = :id
                `

                const result = await sequelize.query(query, {
                    replacements: { id },
                    type: QueryTypes.DELETE
                })

                // Check if any rows were affected
                if (result[0] === 0) {
                    throw createError({
                        statusCode: 404,
                        message: 'Time entry not found'
                    })
                }

                return {
                    statusCode: 200,
                    body: { message: 'Time entry deleted successfully' }
                }
            } catch (error) {
                console.error('Time entry deletion error:', error)
                throw createError({
                    statusCode: error.statusCode || 500,
                    message: error.message || 'Failed to delete time entry'
                })
            }

        default:
            throw createError({
                statusCode: 405,
                message: 'Method Not Allowed'
            })
    }
})
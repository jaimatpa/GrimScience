import { QueryTypes } from "sequelize"
import sequelize from "~/server/utils/databse"

interface TimeVerification {
    weekSunday: string
}


export default defineEventHandler(async (event) => {
    const method = event._method
    const { user: employee } = parseCookies(event);
    console.log("api hit")
    const employeeId = JSON.parse(employee).UniqueID
    switch (method.toUpperCase()) {
        case "GET":
            try {
                const { weekSunday } = getQuery(event)

                if (!weekSunday) {
                    throw createError({
                        statusCode: 400,
                        message: 'weekSunday and employeeId are required'
                    })
                }

                // Get verification status
                const verifyQuery = `
                    SELECT 
                        VerifyBy, 
                        VerifyDate,
                        weekSunday
                    FROM tblTimeVerify
                    WHERE weekSunday = :weekSunday 
                    AND employeeID = :employeeId
                `

                const verifyResult = await sequelize.query(verifyQuery, {
                    replacements: {
                        weekSunday,
                        employeeId
                    },
                    type: QueryTypes.SELECT
                })

                // Get weekly hours summary
                const weekEnd = new Date(weekSunday)
                weekEnd.setDate(weekEnd.getDate() + 6)

                const weeklyQuery = `
                    SELECT 
                        CONVERT(date, StartTime) as date,
                        SUM(hours) as totalHours,
                        MIN(paid) as isPaid
                    FROM tblOperationHoursWorked
                    WHERE employeeID = :employeeId
                    AND CONVERT(date, StartTime) >= :weekStart
                    AND CONVERT(date, StartTime) <= :weekEnd
                    GROUP BY CONVERT(date, StartTime)
                    ORDER BY CONVERT(date, StartTime)
                `

                const weeklyResult = await sequelize.query(weeklyQuery, {
                    replacements: {
                        employeeId,
                        weekStart: weekSunday,
                        weekEnd: weekEnd.toISOString().split('T')[0]
                    },
                    type: QueryTypes.SELECT
                })

                return {
                    statusCode: 200,
                    body: {
                        verification: verifyResult[0] || null,
                        weeklyHours: weeklyResult
                    }
                }
            } catch (error) {
                console.error('Verification status check error:', error)
                throw createError({
                    statusCode: error.statusCode || 500,
                    message: error.message || 'Failed to check verification status'
                })
            }

        case "POST":
            try {
                const body = await readBody(event) as TimeVerification

                if (!body.weekSunday) {
                    throw createError({
                        statusCode: 400,
                        message: 'Missing required fields'
                    })
                }

                const transaction = await sequelize.transaction()

                try {
                    // Calculate week end date
                    const weekEnd = new Date(body.weekSunday)
                    weekEnd.setDate(weekEnd.getDate() + 6)

                    // Delete existing verification if any
                    const deleteQuery = `
                        DELETE FROM tblTimeVerify 
                        WHERE weeksunday = :weekSunday 
                        AND employeeID = :employeeId
                    `

                    await sequelize.query(deleteQuery, {
                        replacements: {
                            weekSunday: body.weekSunday,
                            employeeId: employeeId
                        },
                        type: QueryTypes.DELETE,
                        transaction
                    })
                    const verifiedBy = sequelize.query(`
                              select '#' + payrollno + ' ' + lname + ', ' + fname from tblemployee where active = 1 and tblEmployee.UniqueID =:employeeId 
                              `, {
                        replacements: { employeeId },
                        type: QueryTypes.SELECT,
                        transaction
                    }
                    )
                    console.log(verifiedBy)
                    // Insert new verification
                    const insertQuery = `
                        INSERT INTO tblTimeVerify (
                            VerifyBy,
                            VerifyDate,
                            weekSunday,
                            employeeID
                        ) VALUES (
                            :verifyBy,
                            :verifyDate,
                            :weekSunday,
                            :employeeId
                        )
                    `

                    await sequelize.query(insertQuery, {
                        replacements: {
                            verifyBy: verifiedBy,
                            verifyDate: new Date().toISOString(),
                            weekSunday: body.weekSunday,
                            employeeId: employeeId
                        },
                        type: QueryTypes.INSERT,
                        transaction
                    })

                    // Update paid status for the week's entries
                    const updatePaidQuery = `
                        UPDATE tblOperationHoursWorked
                        SET paid = 1
                        WHERE employeeID = :employeeId
                        AND CONVERT(date, StartTime) >= :weekStart
                        AND CONVERT(date, StartTime) <= :weekEnd
                    `

                    await sequelize.query(updatePaidQuery, {
                        replacements: {
                            employeeId: body.employeeID,
                            weekStart: body.weekSunday,
                            weekEnd: weekEnd.toISOString().split('T')[0]
                        },
                        type: QueryTypes.UPDATE,
                        transaction
                    })

                    await transaction.commit()

                    return {
                        statusCode: 200,
                        body: {
                            message: 'Time entries verified successfully',
                            weekStart: body.weekSunday,
                            weekEnd: weekEnd.toISOString().split('T')[0]
                        }
                    }
                } catch (error) {
                    await transaction.rollback()
                    throw error
                }
            } catch (error) {
                console.error('Time verification error:', error)
                throw createError({
                    statusCode: error.statusCode || 500,
                    message: error.message || 'Failed to verify time entries'
                })
            }

        default:
            throw createError({
                statusCode: 405,
                message: 'Method Not Allowed'
            })
    }
})
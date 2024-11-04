import { H3Event } from 'h3'
import { Op, QueryTypes, Sequelize } from 'sequelize'
import tblZoneChart from '~/server/models/tblZoneChart'
import sequelize from '~/server/utils/databse'

export default defineEventHandler(async (event: H3Event) => {
    try {
        const { zip } = getQuery(event)

        if (!zip) {
            throw createError({
                statusCode: 400,
                message: 'ZIP code is required'
            })
        }
        const result = await sequelize.query(`
        SELECT 
          ground,
          nextdayair,
          nextdayairsaver,
          seconddayair,
          seconddayairam,
          threedayselect
        FROM tblZoneChart
        WHERE :zip BETWEEN low AND high
      `, {
            replacements: { zip },
            type: QueryTypes.SELECT,
            raw: true,
        })
        console.log(result)

        return {
            body:result,
            message: "Success"
        }

    } catch (error) {
        console.error('Zone chart API error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch zone information'
        })
    }
})
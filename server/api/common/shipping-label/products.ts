import { QueryTypes } from "sequelize"
import sequelize from "~/server/utils/databse"


export default defineEventHandler(async (event) => {
    try {
        const { productFlag, page = 1, limit = 50 } = getQuery(event)
        const offset = (page - 1) * limit

        const result = await sequelize.query(`
        SELECT 
            MODEL,
            DESCRIPTION
        FROM tblBP
        WHERE productflag = 1
        AND MODEL IS NOT NULL
        AND MODEL <> ''
        GROUP BY 
            MODEL, 
            DESCRIPTION
        ORDER BY MODEL ASC
        OFFSET :offset ROWS
        FETCH NEXT :limit ROWS ONLY;
        `, {
            replacements: {
                productFlag,
                offset: parseInt(offset),
                limit: parseInt(limit)
            },
            type: QueryTypes.SELECT,
            raw: true,
        })

        // Get total count for pagination
        const [{ total }] = await sequelize.query(`
            SELECT COUNT(DISTINCT MODEL) as total
            FROM tblBP
            WHERE productflag = 1
            AND MODEL IS NOT NULL
            AND MODEL <> ''
        `, {
            type: QueryTypes.SELECT,
            raw: true,
        })

        return {
            body: result.map(product => ({
                label: `#${product.MODEL}${product.DESCRIPTION ? ` - ${product.DESCRIPTION}` : ''}`,
                value: product.MODEL
            })),
            hasMore: offset + result.length < total,
            message: "success"
        }

    } catch (error) {
        console.error('Products API error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch products'
        })
    }
})
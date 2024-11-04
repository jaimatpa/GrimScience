import { QueryTypes } from "sequelize";
import sequelize from "~/server/utils/databse";

export default eventHandler(async (event) => {
    try {
        const { PRODUCTLINE, PARTTYPE, SUBCATEGORY, page = 1, limit = 50 } = getQuery(event);
        const pageSize = parseInt(limit);
        const currentPage = parseInt(page);
        const offset = (currentPage - 1) * pageSize;
        let query = '';
        let countQuery = '';
        let replacements = {};

        if (PRODUCTLINE) {
            query = `
                SELECT * FROM tblBP 
                WHERE productline LIKE :productLine 
                AND uniqueid IN (
                    SELECT MAX(uniqueid) AS uniqueid 
                    FROM tblBP 
                    GROUP BY instanceID
                ) 
                ORDER BY model ASC
                OFFSET :offset ROWS
                FETCH NEXT :limit ROWS ONLY
            `;

            countQuery = `
                SELECT COUNT_BIG(*) as total
                FROM tblBP 
                WHERE productline LIKE :productLine 
                AND uniqueid IN (
                    SELECT MAX(uniqueid) AS uniqueid 
                    FROM tblBP 
                    GROUP BY instanceID
                )
            `;

            replacements = {
                productLine: `${PRODUCTLINE}%`,
                limit: pageSize,
                offset: offset
            };
        }

        if (PARTTYPE && SUBCATEGORY) {
            query = `
                SELECT bp.*, 
                       vi.cnt,
                       vi.SELLINGPRICE
                FROM tblBP bp
                LEFT JOIN vwInventory vi ON vi.instanceid = bp.instanceid 
                WHERE parttype LIKE :partType
                AND subcategory LIKE :subCategory
                AND bp.uniqueid IN (
                    SELECT MAX(uniqueid) AS uniqueid 
                    FROM tblBP 
                    GROUP BY instanceID
                )
                ORDER BY description ASC
                OFFSET :offset ROWS
                FETCH NEXT :limit ROWS ONLY
            `;

            countQuery = `
                SELECT COUNT_BIG(*) as total
                FROM tblBP bp
                LEFT JOIN vwInventory vi ON vi.instanceid = bp.instanceid 
                WHERE parttype LIKE :partType
                AND subcategory LIKE :subCategory
                AND bp.uniqueid IN (
                    SELECT MAX(uniqueid) AS uniqueid 
                    FROM tblBP 
                    GROUP BY instanceID
                )
            `;

            replacements = {
                partType: `${PARTTYPE}%`,
                subCategory: `${SUBCATEGORY}%`,
                limit: pageSize,
                offset: offset
            };
        }

        if (!query) {
            throw createError({
                statusCode: 400,
                message: "Invalid query parameters"
            });
        }

        // Execute the main query and count query in parallel
        const [products, [countResult]] = await Promise.all([
            sequelize.query(query, {
                replacements,
                type: QueryTypes.SELECT
            }),
            sequelize.query(countQuery, {
                replacements,
                type: QueryTypes.SELECT
            })
        ]);

        const totalRecords = parseInt(countResult.total);
        const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

        return {
            body: {
                products,
                pagination: {
                    total: totalRecords,
                    totalPages,
                    currentPage,
                    pageSize,
                    hasMore: currentPage < totalPages,
                    recordsStart: offset + 1,
                    recordsEnd: Math.min(offset + pageSize, totalRecords)
                }
            },
            message: "Products retrieved successfully!"
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Error retrieving products: ${error.message}`
        });
    }
});
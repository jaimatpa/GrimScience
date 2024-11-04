import { QueryTypes } from 'sequelize';
import { createOrModifyShippingRate } from '~/server/controller/utilities/shipping/rate';
import sequelize from '~/server/utils/databse';

export default eventHandler(async (event) => {
    try {
        const method = event._method;

        switch (method.toUpperCase()) {
            case 'GET':
                const query = `
                    SELECT sc.*, sr.*, bp.model, bp.description
                    FROM tblshippingcombinations sc
                    LEFT JOIN tblshippingrates sr ON sr.uniqueid = sc.shippingrateid
                    LEFT JOIN tblbp bp ON bp.uniqueid = sc.bpid
                    WHERE sc.uniqueid IN (
                        SELECT MAX(uniqueid) 
                        FROM tblshippingcombinations 
                        GROUP BY instanceid
                    )
                    ORDER BY sc.name
                `;

                const shippingRates = await sequelize.query(query, {
                    type: QueryTypes.SELECT
                });

                return {
                    body: shippingRates,
                    message: "Shipping rates retrieved successfully!"
                };

            case 'POST':
            case 'PUT':
                const body = await readBody(event);

                if (!body.name || !body.productsOnOrder?.length || !body.rates) {
                    throw createError({
                        statusCode: 400,
                        message: 'Missing required fields'
                    });
                }

                return await createOrModifyShippingRate(body);

            case 'DELETE':
                const { instanceId, shippingRateId } = getQuery(event);

                if (!instanceId || !shippingRateId) {
                    throw createError({
                        statusCode: 400,
                        message: 'Missing required parameters'
                    });
                }

                const transaction = await sequelize.transaction();

                try {
                    // Delete shipping rates
                    await sequelize.query(
                        'DELETE FROM tblshippingrates WHERE uniqueid = :shippingRateId',
                        {
                            replacements: { shippingRateId },
                            type: QueryTypes.DELETE,
                            transaction
                        }
                    );

                    // Delete shipping combinations
                    await sequelize.query(
                        'DELETE FROM tblshippingcombinations WHERE instanceid = :instanceId',
                        {
                            replacements: { instanceId },
                            type: QueryTypes.DELETE,
                            transaction
                        }
                    );

                    await transaction.commit();

                    return {
                        body: { instanceId, shippingRateId },
                        message: 'Package deleted successfully'
                    };
                } catch (error) {
                    await transaction.rollback();
                    throw error;
                }
            default:
                throw createError({
                    statusCode: 405,
                    message: "Method Not Allowed"
                });
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Error processing shipping rates: ${error.message}`
        });
    }
});
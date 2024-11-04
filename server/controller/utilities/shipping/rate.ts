import { QueryTypes } from "sequelize";
import sequelize from "~/server/utils/databse";

export const createOrModifyShippingRate = async (data) => {
    const transaction = await sequelize.transaction();

    try {
        const { name, productsOnOrder, rates, instanceId, shippingRateId } = data;
        let newInstanceId = instanceId;
        let newShippingRateId;

        // If modifying existing record
        if (instanceId) {
            console.log('Deleting existing records');
            // Delete existing records
            await sequelize.query(
                'DELETE FROM tblshippingrates WHERE uniqueid = :shippingRateId',
                {
                    replacements: { shippingRateId: shippingRateId.trim() },
                    type: QueryTypes.DELETE,
                    transaction
                }
            );

            await sequelize.query(
                'DELETE FROM tblshippingcombinations WHERE instanceid = :instanceId',
                {
                    replacements: { instanceId },
                    type: QueryTypes.DELETE,
                    transaction
                }
            );

            newInstanceId = instanceId;
        } else {
            // Get new instance ID for new record
            const [instanceResult] = await sequelize.query(
                'SELECT ISNULL(MAX(CAST(instanceid AS numeric)), 0) + 1 AS newId FROM tblShippingCombinations',
                {
                    type: QueryTypes.SELECT,
                    transaction
                }
            );
            newInstanceId = instanceResult.newId;
        }

        // Map the display rate types to database rate types
        const rateMapping = {
            UPG: 'E',
            UP2: 'B',
            UPN: 'A',
            PM: 'C',
            SM: 'D'
        };

        // Convert incoming rates to database format
        const dbRates = {};
        Object.entries(rates).forEach(([key, value]) => {
            const zoneNum = key.match(/\d/)[0];
            const displayType = key.replace(`SHIPZONE${zoneNum}`, '');
            const dbType = rateMapping[displayType];
            dbRates[`SHIPZONE${zoneNum}${dbType}`] = value;
        });

        // Create shipping rate record
        const columns = Object.keys(dbRates);
        const insertRateQuery = `
            INSERT INTO tblShippingRates (${columns.join(', ')})
            VALUES (${columns.map(col => `:${col}`).join(', ')});
            SELECT SCOPE_IDENTITY() as UniqueID;
        `;

        const [rateResult] = await sequelize.query(insertRateQuery, {
            replacements: dbRates,
            type: QueryTypes.INSERT,
            transaction
        });

        newShippingRateId = rateResult[0].UniqueID;

        // Insert a shipping combination record for each product
        for (const product of productsOnOrder) {
            await sequelize.query(`
                INSERT INTO tblShippingCombinations (
                    NAME,
                    BPID,
                    ShippingRateID,
                    INSTANCEID
                )
                VALUES (
                    :name,
                    :bpid,
                    :shippingRateId,
                    :instanceId
                )
            `, {
                replacements: {
                    name,
                    bpid: product.id,
                    shippingRateId: newShippingRateId,
                    instanceId: newInstanceId
                },
                type: QueryTypes.INSERT,
                transaction
            });
        }

        await transaction.commit();

        // Get the updated/new records
        const records = await sequelize.query(`
            SELECT sc.*, sr.*, bp.model, bp.description
            FROM tblshippingcombinations sc
            LEFT JOIN tblshippingrates sr ON sr.uniqueid = sc.shippingrateid
            LEFT JOIN tblbp bp ON bp.uniqueid = sc.bpid
            WHERE sc.INSTANCEID = :instanceId
        `, {
            replacements: { instanceId: newInstanceId },
            type: QueryTypes.SELECT
        });

        return {
            body: records,
            message: `Shipping rate ${instanceId ? 'updated' : 'created'} successfully`
        };

    } catch (error) {
        await transaction.rollback();
        console.error('Error in shipping rate operation:', error);
        throw new Error(error.message || 'Failed to process shipping rate');
    }
};
import { QueryTypes } from 'sequelize'
import sequelize from '~/server/utils/databse'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const filters = {
        pendingInstallations: query.pendingInstallations === 'true',
        openServiceReports: query.openServiceReports === 'true',
        openSiteVisits: query.openSiteVisits === 'true',
        ordersPending: query.ordersPending === 'true',
        orderQuotes: query.orderQuotes === 'true',
        shippedOrders: query.shippedOrders === 'true',
        openCheckups: query.openCheckups === 'true',
    }
    const filterProduct = query.filterProduct
    const filterProduct2 = query.filterProduct2

    let features = []

    if (filters.pendingInstallations) {
        const sqlQuery = `
            SELECT o.id AS orderID, c.latitude, c.longitude, c.zip, c.address, p.type
            FROM Orders o
            INNER JOIN Customers c ON o.customerId = c.id
            INNER JOIN OrderDetails od ON o.id = od.orderId
            INNER JOIN Products p ON od.productId = p.id
            WHERE o.quotenumber IS NOT NULL
            AND o.orderdate IS NULL
            AND o.status = 'Open'
            AND p.PRODUCTLINE = :filterProduct
        `

        const pendingInstallations = await sequelize.query(sqlQuery, {
            replacements: { filterProduct },
            type: QueryTypes.SELECT
        })

        features = features.concat(pendingInstallations.map(order => ({
            latitude: order.latitude,
            longitude: order.longitude,
            type: 'pendingInstallations',
            id: order.orderID,
            title: order.zip,
            content: `Model #: ${order.type}`,
            address: order.address
        })))
    }

    return { features }
})
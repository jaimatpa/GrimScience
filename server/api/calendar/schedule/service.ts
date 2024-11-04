import { QueryTypes } from "sequelize";
import sequelize from "~/server/utils/databse";
import { format, startOfMonth, endOfMonth } from 'date-fns';

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const { technician, serviceType, openOnly, year, month } = query

    // Build date range conditions
    const selectedDate = new Date(Number(year), Number(month) - 1); 
    const monthStart = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
    const monthEnd = format(endOfMonth(selectedDate), 'yyyy-MM-dd');

    let whereClause = `[SR Date] BETWEEN '${monthStart}' AND '${monthEnd}'`

    if (technician) {
        whereClause += ` AND [Service Tech] LIKE '%${technician}%'`
    }

    if (serviceType) {
        switch (serviceType) {
            case 'Field':
                whereClause += ' AND (REPAIRDESC in (0))'
                break
            case 'Customer':
                whereClause += ' AND (REPAIRDESC in (2))'
                break
            case 'Factory':
                whereClause += ' AND (REPAIRDESC in (1))'
                break
        }
    }

    if (openOnly === 'true') {
        whereClause += " AND Status = 'Open'"
    }

    try {
        // Service Reports with date range
        const serviceReports = await sequelize.query(
            `SELECT * FROM vwServiceReportListing WHERE ${whereClause}`,
            { type: QueryTypes.SELECT }
        )

        // Site Visits with date range
        let siteVisits = []
        if (openOnly === 'true') {
            const siteVisitWhere = technician ? `[By] LIKE '%${technician}%'` : '1=1'
            siteVisits = await sequelize.query(
                `SELECT * FROM tblSiteVisit 
                WHERE ${siteVisitWhere} 
                AND status = 'Open'
                AND VisitDate BETWEEN '${monthStart}' AND '${monthEnd}'`,
                { type: QueryTypes.SELECT }
            )
        }

        // Format the results
        const formattedData = [
            ...serviceReports.map(sr => ({
                startTime: sr['SR Date'],
                subject: `SN#${sr['SN#']} ${sr['Service Tech']}`,
                content: `SR#${sr['SR#']}`,
                status: sr['Status']
            })),
            ...siteVisits.map(sv => ({
                startTime: sv.VisitDate,
                subject: `SV#${sv.VisitNumber} ${sv.By}`,
                content: `SV#${sv.VisitNumber}`,
                status: sv.status
            }))
        ]

        return {
            body: formattedData,
            message: 'Schedule data retrieved successfully'
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Failed to fetch schedule data: ${error.message}`
        });
    }
});
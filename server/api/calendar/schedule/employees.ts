import { QueryTypes } from "sequelize";
import sequelize from "~/server/utils/databse";

export default defineEventHandler(async (event) => {
    try {
        const result = await sequelize.query(
            `SELECT payrollno, fname, lname,'#' + payrollno + ' ' + fname + ' ' + lname as fullName 
      FROM tblEmployee 
      WHERE Active = 1 
      ORDER BY payrollnumber`,
            { type: QueryTypes.SELECT }
        );

        return {
            body: result,
            message: 'Employees retrieved successfully'
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Failed to fetch employees: ${error.message}`
        });
    }
});
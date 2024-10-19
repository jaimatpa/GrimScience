import { Op, QueryTypes, Sequelize } from "sequelize";
import { tblRequisitionDetail, tblBP,tblMaintainenceOrders,tblWorkStation,tblMaintainenceReports,tblMaintReportMeasurements } from "~/server/models";

import sequelize from "~/server/utils/databse";
import util from 'util';


export const getAllEmployeeList = async () => {
    try {
      const reasons = await tblRequisitionDetail.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("EMPLOYEE")), "EMPLOYEE"]
        ],
        order: [["EMPLOYEE", "ASC"]],
        raw: true,
      });
  
      const categories = reasons.map(item => item.EMPLOYEE);
     
      return categories.length ? categories : { error: "No reasons found" };
    } catch (error) {
      console.error("Database error:", error);
      return { error: error.message || "Failed to fetch reasons for change" };
    }
  };
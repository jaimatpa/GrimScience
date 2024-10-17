import { tblComplaints, tblOrder } from "~/server/models";

export const customerIDFromComplaints = async (id) => {
  const customerID = await tblComplaints.findOne({
    attributes: ["CustomerID"],
    where: {
      uniqueID: id,
    },
  });
  return customerID;
};

export const customerIDFromOrder = async (id) => {
  const customerID = await tblOrder.findOne({
    attributes: ["customerID", "orderid"],
    where: {
      uniqueID: id,
    },
  });
  return customerID;
};

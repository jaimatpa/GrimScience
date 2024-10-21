import { tblComplaints, tblOrder, tblSiteVisit } from "~/server/models";

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

export const customerIDFromSite = async (id) => {
  const customerID = await tblSiteVisit.findOne({
    attributes: ["CustomerID", "orderid"],
    where: {
      uniqueID: id,
    },
  });
  return customerID;
};

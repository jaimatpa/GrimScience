import { tblComplaints, tblOrder, tblOrderDetail, tblSiteVisit } from "~/server/models";

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
    attributes: ["customerid", "orderid"],
    where: {
      uniqueID: id,
    },
  });
  return customerID;
};

export const customerIDFromSite = async (id) => {
  const customerID = await tblSiteVisit.findOne({
    attributes: ["CustomerID"],
    where: {
      VisitID: id,
    },
  });
  return customerID;
};


export const customerIDFromOrderDetail = async (id) => {
  const customerID = await tblOrderDetail.findOne({
    attributes: ["orderid"],
    where: {
      UniqueID: id,
    },
  });
  return customerID;
};
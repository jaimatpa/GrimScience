import { Model, Op } from "sequelize";
import type { QueryValue } from "ufo";
import { tblPO, tblPurchase, tblVendors } from "~/server/models";

const applyFilters = (params: any) => {
  const filterParams = ["PONUMBER", "NAME", "IRPHONE", "TOTAL", "OPENCLOSED"];
  const whereClause: any = {};

  // Apply filters for string fields
  filterParams.forEach((param) => {
    if (params[param]) {
      whereClause[param] = {
        [Op.like]: `%${params[param]}%`,
      };
    }
  });

  // Add date filtering if startDate and endDate are provided
  if (params.startDate || params.endDate) {
    whereClause.DATE = {}; // Initialize DATE object
    if (params.startDate) {
      whereClause.DATE[Op.gte] = params.startDate;
    }
    if (params.endDate) {
      whereClause.DATE[Op.lte] = params.endDate;
    }
  }

  return whereClause;
};

export const getAllPurchase = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  const limit = parseInt(pageSize as string, 10) || 50;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;

  const whereClause = applyFilters(filterParams);

  const list = await tblPO.findAll({
    where: whereClause,
    order: [[sortBy || 'PONUMBER', sortOrder || 'DESC']],
    offset,
    limit
  });

  const count = await tblPO.count({ where: whereClause }); 

  return { list, count };
};

export const deletePurchase = async (
  UniqueID: QueryValue | QueryValue[]
): Promise<number> => {
  const deleteResult = await tblPurchase.destroy({
    where: {
      UniqueID,
    },
  });
  console.log(deleteResult);

  return deleteResult;
};

export const createPurchase = async (purchaseData: any): Promise<any> => {
  console.log(purchaseData, " ====> From Material");
  try {
    console.log(purchaseData);
    const createResult = await tblPurchase.create(purchaseData);
    console.log(createResult, " ====> purchase result from material");
    return createResult;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getPurchaseById = async (id: number): Promise<any> => {
  try {
    const purchase = await tblPurchase.findByPk(id);
    console.log(purchase);
    return purchase;
  } catch (error) {
    return error;
  }
};

export const getVendorDropDownList = async (): Promise<any> => {
  try {
    const vendors = await tblVendors.findAll({
      attributes: ["UniqueID", "NAME"],
    });

    return vendors;
  } catch (error) {
    console.log(error);
    return error;
  }
};

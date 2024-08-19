import { Model, Op } from "sequelize";
import type { QueryValue } from "ufo";
import { tblPurchase } from "~/server/models";

const applyFilters = (params: any) => {
  const filterParams = ["UniqueId", "date", "vendor", "phone", "total"];
  const whereClause = {};

  filterParams.forEach((param) => {
    if (params[param]) {
      whereClause[param] = {
        [Op.like]: `%${params[param]}%`,
      };
    }
  });

  return whereClause;
};

export const getAllPurchase = async (
  sortBy: QueryValue | QueryValue[],
  sortOrder: QueryValue | QueryValue[],
  filterParams: any
): Promise<Model<any, any>[]> => {
  const whereClause = applyFilters(filterParams);

  const purchases = await tblPurchase.findAll({
    attributes: ["UniqueId", "date", "vendor", "phone", "total", "open"],
    where: whereClause,
    order: [[(sortBy as string) || "UniqueId", (sortOrder as string) || "ASC"]],
  });

  return purchases;
};

export const deletePurchase = async (
  UniqueId: QueryValue | QueryValue[]
): Promise<number> => {
  const deleteResult = await tblPurchase.destroy({
    where: {
      UniqueId,
    },
  });
  console.log(deleteResult);

  return deleteResult;
};

export const createPurchase = async (purchaseData: any): Promise<any> => {
  const formatPurchaseData = {
    date: new Date(),
    vendor: "Test Vendor",
    phone: "010101010",
    total: 180.0,
    open: true,
  };

  try {
    console.log(purchaseData);
    const createResult = await tblPurchase.create(formatPurchaseData);
    console.log(createResult, " ====> purchase result from material");
    return createResult;
  } catch (error) {
    console.log(error);
    return error;
  }
};

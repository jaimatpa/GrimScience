import { Op } from "sequelize";
import { tblPurchase } from "~/server/models";

const applyFilters = (params) => {
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
  sortBy,
  sortOrder,
  filterParams
): Promise<void> => {
  const whereClause = applyFilters(filterParams);

  const purchases = await tblPurchase.findAll({
    attributes: ["UniqueId", "date", "vendor", "phone", "total", "open"],
    where: whereClause,
    order: [[(sortBy as string) || "UniqueId", (sortOrder as string) || "ASC"]],
  });

  return purchases;
};

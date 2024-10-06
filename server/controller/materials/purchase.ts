import { format } from "date-fns";
import { Model, Op } from "sequelize";
import type { QueryValue } from "ufo";
import { tblPO, tblPurchase, tblVendors } from "~/server/models";

const applyFilters = (params: any) => {
  const filterParams = ["PONUMBER", "DATE", "NAME", "IRPHONE", "TOTAL", "OPENCLOSED"];
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

// export const getAllPurchase = async (
//   sortBy,
//   sortOrder,
//   filterParams
// ) => {
//   const whereClause = applyFilters(filterParams);

//   const purchases = await sequelize.query("select * from tblPO")

//   return purchases;
// };
export const getAllPurchase = async (page, pageSize, sortBy, sortOrder, filterParams) => {


  const limit = parseInt(pageSize as string, 50) || 50;
  const offset = ((parseInt(page as string, 50) - 1) || 0) * limit;
  const whereClause = applyFilters(filterParams);

  const list = await tblPO.findAll({
    where: whereClause,
    order: [[sortBy as string || 'PONUMBER', sortOrder as string || 'DESC']],
    offset,
    limit
  });

  // // Extract the unique vendor IDs from the list
  // const vendorIds = [...new Set(list.map(po => po.VENDOR))];

  // // Fetch vendor names based on the unique vendor IDs
  // const vendors = await tblVendors.findAll({
  //   where: {
  //     UniqueID: vendorIds // Assuming UniqueID is the key in tblVendors
  //   }
  // });
  // // Create a map of vendor IDs to vendor names for quick access
  // const vendorMap = {};
  // vendors.forEach(vendor => {
  //   vendorMap[vendor.UniqueID] = vendor.NAME;
  // });

  // const combinedList = list.map(po => ({
  //   ...po.dataValues,
  //   VENDOR: vendorMap[po.VENDOR] || null
  // }));
  return { list, count: await tblPO.count() }
}
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

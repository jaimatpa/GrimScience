
import { eventHandler } from "h3";
import { getInvoiceProductsByFilters } from "~/server/controller/invoices";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const query = getQuery(event);

    switch (method.toUpperCase()) {
      case 'GET':
        const products = await getInvoiceProductsByFilters({
          productLine: query.productLine,
          model: query.model,
          showOnlyInventory: query.showOnlyInventory,
          category: query.category,
          subcategory: query.subcategory,
          stock: query.stock,
        });
        return { 
          body: products,
          message: 'Products retrieved successfully'
        };


      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Error in products API: ${error.message}`,
    });
  }
});
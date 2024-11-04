import { eventHandler } from 'h3'
import { getProductsByFilters } from '~/server/controller/quotes/quotes';

export default eventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const products = await getProductsByFilters({
      productLine: query.productLine,
      model: query.model,
      showOnlyInventory: query.showOnlyInventory === 'true'
    });

    return {
      body: products
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Error in products lookup API: ${error.message}`
    })
  }
})
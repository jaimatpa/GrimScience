import { getProductLines } from "~/server/controller/sitevisit";

export default eventHandler(async (event) => {
  try {
    const productLines = await getProductLines();
    return { body: productLines };
  } catch (error) {
    throw new Error(`Error fetching product lines: ${error.message}`);
  }
});
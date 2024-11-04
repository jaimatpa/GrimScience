// /api/sitevisit/number

import { getNumberOfSiteVisits } from "~/server/controller/sitevisit";

export default eventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const count = await getNumberOfSiteVisits(query);
    return { body: count };
  } catch (error) {
    throw new Error(`Error counting site visits: ${error.message}`);
  }
});
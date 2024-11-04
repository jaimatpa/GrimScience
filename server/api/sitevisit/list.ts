

import { getSiteVisits } from "~/server/controller/sitevisit";

export default eventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    const { page, pageSize, sortBy, sortOrder, ...filterParams } = query;
    
    const list = await getSiteVisits(page, pageSize, sortBy, sortOrder, filterParams);
    return { body: list };
  } catch (error) {
    throw new Error(`Error fetching site visits: ${error.message}`);
  }
});
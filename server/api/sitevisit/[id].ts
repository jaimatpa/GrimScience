// server/api/sitevisit/[id].ts

import { eventHandler } from 'h3';
import { getSiteVisitDetails } from '~/server/controller/sitevisit';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const siteVisitDetails = await getSiteVisitDetails(id);
    
    if (!siteVisitDetails) {
      throw createError({
        statusCode: 404,
        message: 'Site visit not found'
      });
    }

    return { body: siteVisitDetails };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Error fetching site visit details: ${error.message}`
    });
  }
});
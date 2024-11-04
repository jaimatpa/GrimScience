import { eventHandler } from 'h3';
import { deleteSiteVisit } from '~/server/controller/sitevisit';

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const visitId = body.visitId;

    if (!visitId) {
      throw createError({
        statusCode: 400,
        message: 'Visit ID is required'
      });
    }

    await deleteSiteVisit(visitId);
    
    return { 
      body: {
        message: 'Site visit deleted successfully'
      }
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Error deleting site visit: ${error.message}`
    });
  }
});
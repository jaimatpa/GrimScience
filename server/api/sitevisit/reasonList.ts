import { eventHandler, getQuery } from 'h3';
import { getSiteVisitReasons } from '~/server/controller/sitevisit';

export default eventHandler(async (event) => {
  try {
    const reasons = await getSiteVisitReasons();
    return { body: reasons };
  } catch (error) {
    throw new Error(`Error fetching reasons: ${error.message}`);
  }
});
import { eventHandler, readBody } from 'h3';
import { updateSiteVisit } from '~/server/controller/sitevisit';

export default eventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const visitId = await updateSiteVisit(data);
    return { body: { visitId } };
  } catch (error) {
    throw new Error(`Error saving site visit: ${error.message}`);
  }
});
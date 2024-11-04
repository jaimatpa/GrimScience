import { getStates } from "~/server/controller/sitevisit";

export default eventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const territory = query.territory as string;
    const states = await getStates(territory);
    return { body: states };
  } catch (error) {
    throw new Error(`Error fetching states: ${error.message}`);
  }
});
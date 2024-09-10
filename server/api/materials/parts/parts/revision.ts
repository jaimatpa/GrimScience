import { createParts, getPartsDetail, PartsExistByID, updatePartsByRevisionID } from "~/server/controller/materials/Parts";

export default eventHandler(async (event) => {
  try {
    console.log("hello");

    const query = getQuery(event);
    const { instanceIdForRevision, id } = query;

    console.log("instance id is", instanceIdForRevision);
    console.log("id is", id);

    // Ensure both query parameters are provided
    if (!instanceIdForRevision || !id) {
      setResponseStatus(event, 400);
      return { error: 'Missing required query parameters: instanceIdForRevision and id' };
    }

    // Check if part exists by id
    const partByRevisionExist = await PartsExistByID(id);
    if (!partByRevisionExist) {
      setResponseStatus(event, 404);
      return { error: 'The part with the given ID does not exist' };
    }

    // Fetch part details
    const detail1 = await getPartsDetail(id);
    console.log("details are", detail1);
    // Update part by revision ID
    const updatedRevisionID = await updatePartsByRevisionID(detail1.dataValues,instanceIdForRevision);

    return {
      body: { updatedRevisionID },
      message: 'Part updated by revision ID successfully'
    };

  } catch (error) {
    console.error(error);
    setResponseStatus(event, 500);
    return { error: 'An error occurred while processing the request' };
  }
});

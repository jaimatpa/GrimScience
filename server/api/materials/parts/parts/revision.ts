import { PartsExistByID, updatePartsByRevisionID } from "~/server/controller/materials/Parts";

export default eventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { instanceIdForRevision, id } = query;

    if (!instanceIdForRevision || !id) {
      setResponseStatus(event, 400);
      return { error: 'Missing required query parameters: instanceIdForRevision and id' };
    }

    const partByRevisionExist = await PartsExistByID(id);
    if (!partByRevisionExist) {
      setResponseStatus(event, 404);
      return { error: 'The part with the given ID does not exist' };
    }

    const reqData = await await readBody(event);
    const updatedRevisionID = await updatePartsByRevisionID(reqData, instanceIdForRevision);
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

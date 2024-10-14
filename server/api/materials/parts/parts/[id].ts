import {
  createParts,
  deleteParts,
  getPartsDetail,
  PartsExistByID,
  updateParts,
  updatePartsByRevisionID,
} from "~/server/controller/materials/Parts";

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;

    const method = event._method;
    const query = getQuery(event);

    switch (method.toUpperCase()) {
      case "GET":
        const idExist = await PartsExistByID(id);
        if (idExist) {
          const detail = await getPartsDetail(id);
          return { body: detail, message: "" };
        } else {
          setResponseStatus(event, 404);
          return { error: "The Employee does not exist" };
        }
      case "PUT":
        const { instanceIdForRevision } = query;

        if (instanceIdForRevision) {
          const partByRevisionExist = await PartsExistByID(id);
          if (partByRevisionExist) {
            const detail1 = await getPartsDetail(id);
            const updatedRevisionID = await updatePartsByRevisionID(detail1);
            return {
              body: { updatedRevisionID },
              message: "Part updated by revision ID successfully!",
            };
          } else {
            setResponseStatus(event, 404);
            return {
              error: "The part with the given revision ID does not exist!",
            };
          }
        } else {
          const idExist1 = await PartsExistByID(id);
          if (idExist1) {
            const reqData = await readBody(event);
            const updatedID = await updateParts(id, reqData);
            return {
              body: { updatedID },
              message: "Part updated successfully!",
            };
          } else {
            setResponseStatus(event, 404);
            return { error: "The part does not exist" };
          }
        }

      case "DELETE":
        const idExist2 = await PartsExistByID(id);
        if (idExist2) {
          const deletedID = await deleteParts(id);
          return {
            body: { deletedID },
            message: "Parts deleted successfully!",
          };
        } else {
          setResponseStatus(event, 404);
          return { error: "The parts does not exist" };
        }

      case "POST":
        const reqData = await readBody(event);
        const createdId = await createParts(reqData);

        return { body: { createdId }, message: "Part created successfully" };
      
        default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});

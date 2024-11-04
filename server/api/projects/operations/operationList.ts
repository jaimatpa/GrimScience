import { getJobOperationsWithEmployees } from "~/server/controller/projects/projects";

export default eventHandler(async (event) => {
  try {
    const params = getQuery(event);

    const operationID = Number(params.operationId);
    const jobId = Number(params.jobid);

    const operationList = await getJobOperationsWithEmployees(
      jobId,
      operationID
    );

    switch (event._method.toUpperCase()) {
      case "GET":
        if (operationList) {
          return { body: operationList, message: "Success!" };
        } else {
          setResponseStatus(event, 404);
          return { error: "The operation does not exist" };
        }
        break;

      default:
        setResponseStatus(event, 405);
        return { error: "Method not allowed" };
    }
  } catch (error) {
    console.error("Error handling request:", error);
    setResponseStatus(event, 500);
    return { error: "Internal Server Error" };
  }
});

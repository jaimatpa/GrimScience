import {
  getMaxJobId,
  insertLinkedJob,
} from "~/server/controller/projects/projects";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const id = event.context.params.id;
    const body = await readBody(event);

    let maxId;

    if (body.selectedCustomer) {
      maxId = body.selectedCustomer;
    } else {
      maxId = await getMaxJobId();
    }

    if (method.toUpperCase() === "POST") {
      const result = await insertLinkedJob(body.jobData, maxId);

      if (result.success) {
        return { body: result, message: "Data inserted successfully" };
      } else {
        setResponseStatus(event, 404);
        return { error: "Data insertion failed" };
      }
    } else {
      setResponseStatus(event, 405);
      return { error: "Method not allowed" };
    }
  } catch (error) {
    console.error("Error handling request:", error);
    setResponseStatus(event, 500);
    return { error: "Internal Server Error" };
  }
});

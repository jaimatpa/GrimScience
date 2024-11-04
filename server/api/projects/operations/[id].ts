import { deleteJobOperation } from "~/server/controller/projects/projects";

export default eventHandler(async (event) => {
    try {
      const id = event.context.params.id;
      const method = event._method;
  
      switch (method.toUpperCase()) {
        case "DELETE":
          const deletedID = await deleteJobOperation(id);
          return {
            body: { deletedID },
            message: "Operation deleted successfully",
          };
  
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
  
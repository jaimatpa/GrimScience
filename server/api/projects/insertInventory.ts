import { getMaxJobId, insertJobDetails } from "~/server/controller/projects/projects";

export default eventHandler(async (event) => {
  try {
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'POST':
        // Get the data to insert
        const data = await readBody(event);
        let maxId;

        // Get the max ID from tblJobs or use the selected customer ID
        if (data.selectedCustomer) {
          maxId = data.selectedCustomer;
        } else {
          maxId = await getMaxJobId();
        }

        console.log("Data is", data);

        // Insert the data into tblJobdetail
        await insertJobDetails(data.tableOfCompletion, maxId);

        return { body: { message: 'Job details inserted successfully!' }, status: 201 };

      default:
        setResponseStatus(event, 405); // Method Not Allowed
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error processing request: ${error.message}`);
  }
});

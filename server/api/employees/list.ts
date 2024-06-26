import { getAllEmployees } from "~/server/controller/employees";

export default eventHandler(async (event) => {
    const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event);
  try {
    const employeeList = await getAllEmployees(page, pageSize, sortBy, sortOrder, filterParams);
    return {body: employeeList, message: ''};
  } catch (error) {
    setResponseStatus(event, 500);
    console.log(error.message)
    return { error: error.message };
  }
});

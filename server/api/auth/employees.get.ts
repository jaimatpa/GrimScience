import { getEmployeeFullNames } from "~/server/controller/employees";

export default eventHandler(async (event) => {
  try {
    const employeeList = await getEmployeeFullNames();
    return { body: employeeList, message: '' };
  } catch (error) {
    setResponseStatus(event, 500);
    console.log(error.message)
    return { error: error.message };
  }
});

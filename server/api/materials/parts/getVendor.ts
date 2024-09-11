// ~/server/api/vendor.js (or another appropriate path)
import { getVendorNames } from '~/server/controller/materials/Parts';
import { defineEventHandler, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    console.log("vendor coming");

    const method = event.req.method; // Use event.req.method to get the HTTP method

    switch (method.toUpperCase()) {
      case 'GET':
        const list = await getVendorNames();
        return { body: list, message: '' };
      default:
        setResponseStatus(event, 405); // Set status for Method Not Allowed
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error fetching data from table:', error.message);
    setResponseStatus(event, 500); // Set status for Internal Server Error
    return { error: `Error fetching data from table: ${error.message}` };
  }
});

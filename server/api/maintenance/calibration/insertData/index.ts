import { insertCalibrationData} from '~/server/controller/maintenance/calibration';

export default eventHandler(async (event) => {
    try {
        const { method } = event.node.req;
        switch (method.toUpperCase()) {
            case 'POST':
                const { type } = getQuery(event);
                const body = await readBody(event);
                if (type === 'insert01') {
                    const employeeList = await insertCalibrationData(body);
                    return { employeeList };
                }  else {
                    setResponseStatus(event, 400);
                    return { error: 'Invalid type specified. Use "employee" or "table".' };
                }

            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        setResponseStatus(event, 500);
        return { error: `Error fetching data: ${error.message}` };
    }
});
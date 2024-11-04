import { getAllSubcategoriesList, getAllWorkCenters, getAllActiveEmployees, getCalibrationTableData01, getAllInstrumentLocations, getAllUOMList,getAllCalibrationsList } from '~/server/controller/maintenance/calibration';

export default eventHandler(async (event) => {

    try {
        const { method } = event.node.req;
     
        switch (method.toUpperCase()) {
            case 'GET':
                const { type, ...filterParams } = getQuery(event);
                if (type === 'subCategory') {
                    const subList = await getAllSubcategoriesList();
                    return { subList };

                } else if (type === 'workCenter') {
                    const workCenter = await getAllWorkCenters();
                    return { workCenter };

                } else if (type === 'instrument') {
                    const instrumentList = await getAllInstrumentLocations();
                    return { instrumentList };

                }
                else if (type === 'UOMList') {
                    const uomList = await getAllUOMList();
                    return { uomList };
                    
                } else if (type === 'user') {
                    const userList = await getAllActiveEmployees();
                    return { userList };

                }  else if (type === 'Calibration') {
                    const calList = await getAllCalibrationsList();
                    return { calList };

                } else if (type === 'table') {
                    const tableList = await getCalibrationTableData01(filterParams);
                    return { tableList };

                } else {
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

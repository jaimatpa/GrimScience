


import {getCompanyInfoId ,getDatabaseConfig} from '~/server/controller/utilities/Settings';

export default eventHandler(async (event) => {

    try {
        const { method } = event.node.req;
     
        switch (method.toUpperCase()) {
            case 'GET':
                const { type, ...filterParams } = getQuery(event);
                if (type === 'companyInfo') {
                    const companyDataList = await getCompanyInfoId();
                    return { companyDataList };

                 } 
                 else if (type === 'envFle') {
                    const sqlData = await getDatabaseConfig();
                    return { sqlData };

                } 
                   else {
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

import {
  getAllReportByData, getAllReportWhereData, getAllReportSub1Data, getAllReportSearchData,
  getAllReportUOMData,getReportInstrumentData
} from '~/server/controller/maintenance/equipment';

export default eventHandler(async (event) => {
  try {
    const { method } = event.node.req;

    switch (method.toUpperCase()) {
      case 'GET':
        // Check for query parameters to differentiate between equipment and type requests
        const { type, subCategory } = getQuery(event);

        if (type === 'by') {
          const equipmentList = await getAllReportByData();

          return { equipmentList };

        } else if (type === 'where') {
          const whereList = await getAllReportWhereData();
          return { whereList };
        } else if (type === 'sub1') {
          const subList = await getAllReportSub1Data();
          return { subList };
        } else if (type === 'UOM') {
          const uomList = await getAllReportUOMData();
          return { uomList };
        } else if (type === 'Search1') {
          const search1List = await getAllReportSearchData(subCategory);
          return { search1List }

        } else if (type === 'instrument') {
          const search1List = await getReportInstrumentData(subCategory);
          return { search1List }

        }
        else {
          return { error: 'Invalid type specified. Use "equipment" or "types".' };
        }

      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});

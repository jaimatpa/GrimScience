import sequelize from "~/server/utils/databse";

export default async function handler(event) {
    const { id, recOOaName } = getQuery(event); 

    try {
        // Fetch the data from tblbp based on the selected ID
        let [bpDetails] = await sequelize.query(`
      SELECT * 
      FROM tblbp 
      WHERE UniqueID = ${id};
    `);

        if (bpDetails.length === 0) {
            return {
                statusCode: 404,
                body: { error: 'Record not found' }
            };
        }

        // Get the first record from the result
        const bpDetail = bpDetails[0];

        // Determine which fields to populate based on recOOaName
        let response = {
            qty1: '',
            qty2: '',
            qty3: '',
            qty4: '',
            qty5: '',
            price1: '',
            price2: '',
            price3: '',
            price4: '',
            price5: '',
        };

        if (recOOaName === bpDetail.primarymantxt || recOOaName === bpDetail.primarydeatxt) {
            response = {
                qty1: bpDetail.primaryqty1 || '',
                qty2: bpDetail.primaryqty2 || '',
                qty3: bpDetail.primaryqty3 || '',
                qty4: bpDetail.primaryqty4 || '',
                qty5: bpDetail.primaryqty5 || '',
                price1: bpDetail.primaryprice1 || '',
                price2: bpDetail.primaryprice2 || '',
                price3: bpDetail.primaryprice3 || '',
                price4: bpDetail.primaryprice4 || '',
                price5: bpDetail.primaryprice5 || '',
            };
        } else if (recOOaName === bpDetail.alter1mantxt || recOOaName === bpDetail.alter1deatxt) {
            response = {
                qty1: bpDetail.alter1qty1 || '',
                qty2: bpDetail.alter1qty2 || '',
                qty3: bpDetail.alter1qty3 || '',
                qty4: bpDetail.alter1qty4 || '',
                qty5: bpDetail.alter1qty5 || '',
                price1: bpDetail.alter1price1 || '',
                price2: bpDetail.alter1price2 || '',
                price3: bpDetail.alter1price3 || '',
                price4: bpDetail.alter1price4 || '',
                price5: bpDetail.alter1price5 || '',
            };
        } else if (recOOaName === bpDetail.alter2mantxt || recOOaName === bpDetail.alter2deatxt) {
            response = {
                qty1: bpDetail.alter2qty1 || '',
                qty2: bpDetail.alter2qty2 || '',
                qty3: bpDetail.alter2qty3 || '',
                qty4: bpDetail.alter2qty4 || '',
                qty5: bpDetail.alter2qty5 || '',
                price1: bpDetail.alter2price1 || '',
                price2: bpDetail.alter2price2 || '',
                price3: bpDetail.alter2price3 || '',
                price4: bpDetail.alter2price4 || '',
                price5: bpDetail.alter2price5 || '',
            };
        }

        return {
            statusCode: 200,
            body: response
        };
    } catch (error) {
        console.error('Error fetching vendor invoice details:', error);
        return {
            statusCode: 500,
            body: { error: 'Internal Server Error' }
        };
    }
}

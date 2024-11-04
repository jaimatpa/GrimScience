import {
  eventHandler,
  setResponseStatus,
  defineEventHandler,
  readBody,
} from "h3";
import sequelize from "~/server/utils/databse";
import { QueryTypes } from "sequelize";
import { format } from "date-fns";
import { tblOrder } from "~/server/models";

const formatDate = (date) => {
  const today = new Date(date);
  return String(today.getMonth() + 1).padStart(2, '0') + '/' +
    String(today.getDate()).padStart(2, '0') + '/' +
    today.getFullYear();
}

// 8. Source Population
export const getSources = async () => {
  try {
    const results = await sequelize.query(
      `
      SELECT DISTINCT source 
      FROM tblorder 
      WHERE source IS NOT NULL AND source <> ''
      ORDER BY source ASC
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    return results.map((item) => item.source);
  } catch (error) {
    console.error("Error fetching sources:", error.message);
    throw new Error(error.message);
  }
};

// 3. Status Combo Box Population
export const getOrderStatus = async () => {
  try {
    const results = await sequelize.query(
      `
      SELECT DISTINCT status 
      FROM tblOrder 
      WHERE status IS NOT NULL AND status <> ''
      ORDER BY status ASC
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    return results.map((item) => item.status);
  } catch (error) {
    console.error("Error fetching order statuses:", error.message);
    throw new Error(error.message);
  }
};

// 2. Product Line Combo Box Population
export const getProductLines = async () => {
  try {
    const results = await sequelize.query(
      `
      SELECT DISTINCT productline 
      FROM tblBP 
      WHERE productflag = 1 
        AND productline IS NOT NULL 
        AND productline <> '' 
        AND productline <> 'Parts' 
      ORDER BY productline
    `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return results.map((item) => item.productline);
  } catch (error) {
    console.error("Error fetching product lines:", error.message);
    throw new Error(error.message);
  }
};

// 7. Source Description Population
export const getSourceDescriptions = async (source) => {
  try {
    const results = await sequelize.query(
      `
      SELECT DISTINCT sourcedescription 
      FROM tblorder 
      WHERE source = :source 
      ORDER BY sourcedescription ASC
    `,
      {
        replacements: { source },
        type: QueryTypes.SELECT,
      }
    );

    const sourceDescriptions = results
      .map((item) => item.sourcedescription)
      .map((description) => description.trim());

    return sourceDescriptions.filter((description) => description !== "");
  } catch (error) {
    console.error("Error fetching source descriptions:", error.message);
    throw new Error(error.message);
  }
};

// 1. Permission Check Query
export const getPermissions = async (system, subsystem) => {
  try {
    const [results] = await sequelize.query(
      `
      SELECT MenuItem, ReadOnlyIDs, FullAdminIDs 
      FROM tblPermissions 
      WHERE system = :system AND subsystem = :subsystem
    `,
      {
        replacements: { system, subsystem },
        type: QueryTypes.SELECT,
      }
    );
    return results;
  } catch (error) {
    console.error("Error fetching permissions:", error.message);
    throw new Error(error.message);
  }
};

// 4. Main List View Population (Multiple Variants)
export const getOrderDetails = async (params) => {
  try {
    let baseQuery = `
      FROM tblOrder o
      INNER JOIN tblCustomers c ON c.UniqueID = o.customerid
      LEFT JOIN tblOrderDetail od ON od.orderid = o.uniqueid
      LEFT JOIN tblBP bp ON bp.uniqueID = od.bpid
    `;

    const whereConditions = ["o.quotenumber <> 0"];
    const replacements = {};

    if (params.invoicedate) {
      whereConditions.push(`(
        CONVERT(VARCHAR(10), o.invoicedate, 101) LIKE :invoicedate 
        OR YEAR(o.invoicedate) = :invoiceyear
        OR MONTH(o.invoicedate) = :invoicemonth
        OR DAY(o.invoicedate) = :invoiceday
      )`);
      replacements.invoicedate = `%${params.invoicedate}%`;
      replacements.invoiceyear = parseInt(params.invoicedate) || null;
      replacements.invoicemonth = parseInt(params.invoicedate) || null;
      replacements.invoiceday = parseInt(params.invoicedate) || null;
    }

    if (params.filterDate === "true" && params.startDate && params.endDate) {
      whereConditions.push(
        "CAST(o.invoicedate AS DATE) BETWEEN :startDate AND :endDate"
      );
      replacements.startDate = params.startDate + " 00:00:00";
      replacements.endDate = params.endDate + " 23:59:59";
    }

    if (params.customerNumber) {
      whereConditions.push("c.number LIKE :customerNumber");
      replacements.customerNumber = `%${params.customerNumber}%`;
    }

    if (params.quotenumber) {
      whereConditions.push("o.quotenumber LIKE :quotenumber");
      replacements.quotenumber = `%${params.quotenumber}%`;
    }

    if (params.customerName) {
      whereConditions.push(
        "(c.fname LIKE :customerName OR c.lname LIKE :customerName)"
      );
      replacements.customerName = `%${params.customerName}%`;
    }

    if (params.company1) {
      whereConditions.push("c.company1 LIKE :company1");
      replacements.company1 = `%${params.company1}%`;
    }

    if (params?.statusFilters) {
      const statusMappings = {
        quotePending: "Quote Pending",
        open: "Open",
        closed: "Closed",
        orderPending: "Order Pending",
        booked: "Booked",
      };
      const statusFiltersArray = [].concat(params.statusFilters);
      const statusValues = statusFiltersArray.map(
        (filter) => statusMappings[filter]
      );
      whereConditions.push("o.status IN (:statusValues)");
      replacements.statusValues = statusValues;
    }

    if (params.model) {
      whereConditions.push("bp.Model LIKE :model");
      replacements.model = `%${params.model}%`;
    }

    if (params.Source) {
      whereConditions.push("o.source = :source");
      replacements.source = params.Source;
    }

    if (params.productLine) {
      whereConditions.push("bp.productline = :productLine");
      replacements.productLine = params.productLine;
    }

    if (params.status) {
      whereConditions.push("o.status = :status");
      replacements.status = params.status;
    }

    if (params.sourcedescription) {
      whereConditions.push("o.sourcedescription = :sourcedescription");
      replacements.sourcedescription = params.sourcedescription;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const countQuery = `SELECT COUNT(DISTINCT o.uniqueid) as total ${baseQuery} ${whereClause}`;

    let dataQuery = `
      SELECT DISTINCT
        o.status, o.total, o.source AS Source, 
        o.sourcedescription, o.uniqueid, o.customerid, o.orderid, 
        o.invoicenumber, o.orderdate, o.shipdate, o.invoicedate, 
        o.quotenumber, o.expirationdate, o.EstimatedBooking, o.Estimatedship,
        c.number AS customerNumber, CONCAT(c.fname, ' ', c.lname) AS customerName, 
        c.company1, c.zip,
        bp.productline AS productLine
      ${baseQuery}
      ${whereClause}
      ORDER BY o.invoicedate DESC, o.invoicenumber DESC
    `;

    const page = parseInt(params.page) || 1;
    const pageSize = parseInt(params.pageSize) || 50;
    const offset = (page - 1) * pageSize;

    dataQuery += ` OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY`;
    replacements.offset = offset;
    replacements.pageSize = pageSize;

    const [countResult] = await sequelize.query(countQuery, {
      replacements: replacements,
      type: QueryTypes.SELECT,
    });

    const results = await sequelize.query(dataQuery, {
      replacements: replacements,
      type: QueryTypes.SELECT,
    });

    const uniqueResults = Array.from(
      results
        .reduce((map, item) => {
          const key = item.uniqueid;
          map.set(key, {
            ...item,
            class: "",
          });
          return map;
        }, new Map())
        .values()
    );

    const total = parseInt(countResult.total);

    return {
      orders: uniqueResults,
      pagination: {
        page,
        pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw new Error(`Database error: ${error.message}`);
  }
};

export const getQuoteNumber = async (orderId) => {
  try {
    const [result] = await sequelize.query(
      `
      select  MAX(quotenumber+1) AS quotenumber from tblOrder where quotenumber <> 0
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    // Get the current date
    const invoicedate = new Date();

    // Create a new date for one month later
    const expirationdate = new Date(invoicedate);
    expirationdate.setMonth(invoicedate.getMonth() + 1);
    return {
      quotenumber: result.quotenumber,
      invoicedate,
      expirationdate
    };
  } catch (error) {
    console.error("Error fetching product line:", error.message);
    throw new Error(error.message);
  }
};

// 5. Product Line Retrieval
export const getProductLine = async (orderId) => {
  try {
    const [results] = await sequelize.query(
      `
      SELECT Productline 
      FROM tblBP 
      INNER JOIN tblOrderDetail ON tblBP.uniqueID = tblOrderDetail.bpid 
      WHERE orderid = :orderId
    `,
      {
        replacements: { orderId },
        type: QueryTypes.SELECT,
      }
    );
    return results;
  } catch (error) {
    console.error("Error fetching product line:", error.message);
    throw new Error(error.message);
  }
};

// 6. Customer ID Retrieval
export const getCustomerId = async (orderId) => {
  try {
    const [results] = await sequelize.query(
      `
      SELECT customerid 
      FROM tblorder 
      WHERE uniqueid = :orderId
    `,
      {
        replacements: { orderId },
        type: QueryTypes.SELECT,
      }
    );
    return results;
  } catch (error) {
    console.error("Error fetching customer ID:", error.message);
    throw new Error(error.message);
  }
};

// 9. Order Deletion
export const deleteOrder = async (orderId) => {
  try {
    await sequelize.transaction(async (t) => {
      await sequelize.query(
        `
        DELETE FROM tblorderdetail 
        WHERE orderid = :orderId
      `,
        {
          replacements: { orderId },
          type: QueryTypes.DELETE,
          transaction: t,
        }
      );

      await sequelize.query(
        `
        DELETE FROM tblorder 
        WHERE uniqueid = :orderId
      `,
        {
          replacements: { orderId },
          type: QueryTypes.DELETE,
          transaction: t,
        }
      );
    });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    throw new Error(error.message);
  }
};

export const getQuotesByCustomer = async (customerId) => {
  const invoiceOrders = await sequelize.query(
    `SELECT uniqueid,
       status as openclosed,
       invoicedate as DateTime,
       quotenumber as number
FROM tblOrder
WHERE (quotenumber <> 0 or quotenumber <> null)
  AND Orderdate = ''
  AND CustomerID = :customerId
ORDER BY uniqueid DESC`,
    {
      replacements: { customerId },
      type: QueryTypes.SELECT,
    }
  );

  return invoiceOrders;
};

// Form
export const getOrderDetailById = async (id) => {
  const tableDetail = await tblOrder.findByPk(id);
  return tableDetail;
};

export const orderExistByID = async (id: number | string) => {
  const tableDetail = await tblOrder.findByPk(id);
  if (tableDetail) return true;
  else return false;
};


export const getProductsByFilters = async (params) => {
  try {
    let baseQuery = `
      SELECT DISTINCT
        bp.productline,
        bp.model,
        bp.description,
        bp.SELLINGPRICE,
        bp.uniqueid,
        bp.instanceid,
        ISNULL(vwi.cnt, 0) as inventoryCount
      FROM tblBP bp
      LEFT JOIN vwInventory vwi ON vwi.instanceid = bp.instanceid
      WHERE bp.uniqueid IN (
        SELECT MAX(uniqueid) as uniqueid 
        FROM tblBP 
        GROUP BY instanceID
      )
    `;

    const whereConditions = [];
    const replacements = {};

    if (params.productLine) {
      whereConditions.push("bp.productline LIKE :productLine");
      replacements.productLine = `${params.productLine}%`;
    }

    if (params.model) {
      whereConditions.push("bp.model LIKE :model");
      replacements.model = `${params.model}%`;
    }

    whereConditions.push("bp.CODE <> 'Obsolete' AND bp.CODE <> 'Inactive'");

    if (params.showOnlyInventory) {
      whereConditions.push("vwi.cnt > 0");
    }

    if (whereConditions.length > 0) {
      baseQuery += ` AND ${whereConditions.join(" AND ")}`;
    }

    baseQuery += ` ORDER BY bp.model ASC`;

    const results = await sequelize.query(baseQuery, {
      replacements,
      type: QueryTypes.SELECT,
    });

    return results.map((item) => ({
      productline: item.productline,
      model: item.model,
      description: item.description,
      sellingPrice: parseFloat(item.SELLINGPRICE || 0),
      uniqueid: item.uniqueid,
      instanceid: item.instanceid,
      hasInventory: item.inventoryCount > 0,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(`Database error: ${error.message}`);
  }
};


export const getTblOrderDetails = async (orderId: number) => {
  try {
    const query = `
      SELECT 
        od.quantity,
        od.type as number,
        od.name as description,
        od.price,
        od.serial,
        od.uniqueid,
        od.inventoryid,
        od.bpid
      FROM tblOrderDetail od
      WHERE od.orderid = :orderId
      ORDER BY od.uniqueid ASC
    `;

    const results = await sequelize.query(query, {
      replacements: { orderId },
      type: QueryTypes.SELECT,
    });

    return results.map((row) => ({
      quantity: parseInt(row.quantity) || 0,
      number: row.number || "",
      description: row.description || "",
      price: parseFloat(row.price) || 0,
      serial: row.serial || "",
      uniqueid: row.uniqueid,
      inventoryid: row.inventoryid,
      bpid: row.bpid,
    }));
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw new Error(`Database error: ${error.message}`);
  }
};

// Add from product line
export const addOrderDetail = async (orderDetail) => {
  try {

    const [data] = await sequelize.query(
      `
      select  MAX(UniqueID+1) AS uniqueID from tblOrder
    `,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!orderDetail.orderid) {

      await sequelize.query(
        `
        INSERT INTO tblOrder (
          customerid,
          orderid, 
          invoicenumber,
          soldby,
          zone,
          purchaseordernumber,
          fob,
          invoicedate,
          quotenumber,
          expirationdate,
          status
        ) VALUES (
          :customerid,
          :orderid, 
          :invoicenumber,
          :soldby,
          :zone,
          :purchaseordernumber,
          :fob,
          :invoicedate,
          :quotenumber,
          :expirationdate,
          :status
        )
      `,
        {
          replacements: {
            customerid: orderDetail.customerid,
            orderid: data.uniqueID,
            invoicenumber: data.uniqueID,
            soldby: orderDetail.username,
            zone: '',
            purchaseordernumber: '',
            fob: '',
            invoicedate: formatDate(orderDetail.invoicedate),
            quotenumber: orderDetail.quotenumber,
            expirationdate: formatDate(orderDetail.expirationdate),
            status: orderDetail.status
          },
          type: QueryTypes.UPDATE,
        }
      );
    }

    orderDetail.orderid = data.uniqueID


    const query = `
      INSERT INTO tblOrderDetail (
        orderid,
        quantity, 
        type,
        name,
        price,
        serial,
        inventoryid,
        bpid
      ) VALUES (
        :orderid,
        :quantity,
        :type,
        :name,
        :price,
        :serial,
        :inventoryid,
        :bpid
      )
    `;

    const result = await sequelize.query(query, {
      replacements: {
        orderid: orderDetail.orderid,
        quantity: orderDetail.quantity,
        type: orderDetail.type,
        name: orderDetail.name,
        price: orderDetail.price,
        serial: orderDetail.serial || "",
        inventoryid: orderDetail.inventoryid || 0,
        bpid: orderDetail.bpid || 0,
      },
      type: QueryTypes.INSERT,
    });

    return data.uniqueID;
  } catch (error) {
    console.error("Error adding order detail:", error);
    throw new Error(`Database error: ${error.message}`);
  }
};

export const removeOrderDetail = async (orderDetailId: number) => {
  try {
    const query = `
      DELETE FROM tblOrderDetail 
      WHERE UniqueID = :orderDetailId
    `;

    const result = await sequelize.query(query, {
      replacements: { orderDetailId },
      type: QueryTypes.DELETE,
    });

    return result;
  } catch (error) {
    console.error("Error removing order detail:", error);
    throw new Error(`Database error: ${error.message}`);
  }
};

export const updateOrderPrice = async (
  orderDetailId: number,
  newPrice: number
) => {
  try {
    const query = `
      UPDATE tblOrderDetail 
      SET price = :newPrice
      WHERE uniqueid = :orderDetailId
    `;

    const result = await sequelize.query(query, {
      replacements: {
        orderDetailId,
        newPrice,
      },
      type: QueryTypes.UPDATE,
    });

    return result;
  } catch (error) {
    console.error("Error updating order price:", error);
    throw new Error(`Database error: ${error.message}`);
  }
};

//Save button controller

export const saveQuote = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    let {
      orderFormData,
      orderDetails,
      order,
      orderid,
      customerid,
    } = body;

    const [data] = await sequelize.query(
      `
      select  MAX(UniqueID+1) AS uniqueID from tblOrder
    `,
      {
        type: QueryTypes.SELECT,
      }
    );


    if (!orderid) {
      await sequelize.query(
        `
        INSERT INTO tblOrder (
          customerid,
          orderid, 
          invoicenumber,
          soldby,
          zone,
          purchaseordernumber,
          fob,
          invoicedate,
          quotenumber,
          expirationdate,
          status
        ) VALUES (
          :customerid,
          :orderid, 
          :invoicenumber,
          :soldby,
          :zone,
          :purchaseordernumber,
          :fob,
          :invoicedate,
          :quotenumber,
          :expirationdate,
          :status
        )
      `,
        {
          replacements: {
            customerid: order.customerid,
            orderid: data.uniqueID,
            invoicenumber: data.uniqueID,
            soldby: order.username,
            zone: '',
            purchaseordernumber: '',
            fob: '',
            invoicedate: formatDate(order.invoicedate),
            quotenumber: order.quotenumber,
            expirationdate: formatDate(order.expirationdate),
            status: order.status
          },
          type: QueryTypes.UPDATE,
        }
      );
      orderid = data.uniqueID
    } else {

      // Start transaction
      await sequelize.transaction(async (transaction) => {
        // 1. Delete existing order details
        const delted = await sequelize.query(
          "DELETE FROM tblOrderDetail WHERE orderid = :orderid",
          {
            replacements: { orderid },
            type: QueryTypes.DELETE,
            transaction,
          }
        );
        // 2. Insert new order details
        for (const item of orderDetails) {
          await sequelize.query(
            `
            INSERT INTO tblOrderDetail (
              orderid,
              quantity, 
              type,
              name,
              price,
              serial,
              inventoryid,
              bpid
            ) VALUES (:orderid, :quantity, :type, :name, :price, :serial, :inventoryid, :bpid)
          `,
            {
              replacements: {
                orderid,
                quantity: item.quantity,
                type: item.type,
                name: item.name,
                price: item.price,
                serial: item.serial || "",
                inventoryid: item.inventoryid || 0,
                bpid: item.bpid || 0,
              },
              type: QueryTypes.INSERT,
              transaction,
            }
          );

          // Update inventory status if needed
          if (item.inventoryid > 0) {
            const invCheck = await sequelize.query(
              "SELECT * FROM tblInventory WHERE uniqueid = :uniqueid AND orderid = :orderid",
              {
                replacements: { uniqueid: item.inventoryid, orderid },
                type: QueryTypes.SELECT,
                transaction,
              }
            );

            if (invCheck.length === 0) {
              // Get existing inventory record
              const invRecord = await sequelize.query(
                "SELECT * FROM tblInventory WHERE uniqueid = ?",
                {
                  replacements: { uniqueid: item.inventoryid },
                  type: QueryTypes.SELECT,
                  transaction,
                }
              );

              if (invRecord.length > 0) {
                // Insert new inventory record
                await sequelize.query(
                  `
                  INSERT INTO tblInventory (
                    Status, orderid, Code, Customer, TODAY
                  ) SELECT 
                    'Shipped', :orderid, 'R', :customerid, NOW()
                  FROM tblInventory 
                  WHERE uniqueid = :
                `,
                  {
                    replacements: { orderid, customerid, uniqueid: item.inventoryid },
                    type: QueryTypes.INSERT,
                    transaction,
                  }
                );
              }
            }
          }
        }

        // 3. Update main order record
        const {
          source,
          sourcedescription,
          invoicedate,
          expirationdate,
          estimatedbooking,
          estimatedship,
          Quote,
          Notes,
          status,
          subtotal,
          tax,
          shipping,
          cod,
          lessdiscount,
          lessdown,
          total,
        } = orderFormData;

        await sequelize.query(
          `
          UPDATE tblOrder SET
            source = ?,
            sourcedescription = ?,
            invoicedate = ?,
            expirationdate = ?,
            estimatedbooking = ?,
            estimatedship = ?,
            Quote = ?,
            Notes = ?,
            status = ?,
            subtotal = ?,
            tax = ?,
            shipping = ?,
            cod = ?,
            lessdiscount = ?,
            lessdown = ?,
            total = ?
          WHERE uniqueid = ?
        `,
          {
            replacements: [
              source,
              sourcedescription,
              invoicedate,
              expirationdate,
              estimatedbooking,
              estimatedship,
              Quote,
              Notes,
              status,
              subtotal || 0,
              tax || 0,
              shipping || 0,
              cod || 0,
              lessdiscount || 0,
              lessdown || 0,
              total || 0,
              orderid,
            ],
            type: QueryTypes.UPDATE,
            transaction,
          }
        );
      });

    }



    return {
      statusCode: 200,
      orderid: orderid,
      body: {
        success: true,
        message: "Quote saved successfully",
      },
    };
  } catch (error) {
    console.error("Error saving quote:", error);
    return {
      statusCode: 500,
      body: {
        success: false,
        message: "Failed to save quote",
        error: error.message,
      },
    };
  }
});


//preview pdf

export const getQuoteForPreview = async (id: string) => {
  const quote = await sequelize.query(
    `SELECT o.*, c.* 
     FROM tblOrder o
     LEFT JOIN tblCustomers c ON c.uniqueid = o.customerid
     WHERE o.uniqueid = :id`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
      raw: true
    }
  );

  const items = await sequelize.query(
    `SELECT * FROM tblOrderDetail
     WHERE orderid = :id`,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
      raw: true
    }
  );

  return {
    quote: quote[0],
    items
  };
};


export const exportQuotesData = async (params: any) => {
  try {
    // Base query similar to your OrderDetails query but with joins
    let baseQuery = `
      SELECT DISTINCT
        o.invoicedate,
        o.quotenumber,
        o.source,
        o.sourcedescription,
        o.status,
        bp.productline,
        c.number as customerNumber,
        CONCAT(c.fname, ' ', c.lname) as customerName,
        c.company1,
        o.expirationdate,
        o.EstimatedBooking,
        o.Estimatedship,
        od.type,
        od.name,
        od.price,
        od.quantity,
        CAST(o.invoicedate as datetime) as orderDate  -- Added for ORDER BY
      FROM tblOrder o
      LEFT JOIN tblCustomers c ON c.uniqueid = o.customerid
      LEFT JOIN tblOrderDetail od ON od.orderid = o.uniqueid
      LEFT JOIN tblBP bp ON bp.uniqueid = od.bpid
      WHERE (o.quotenumber <> 0 OR o.quotenumber IS NOT NULL)
    `;

    const whereConditions = [];
    const replacements = {};

    // Filter conditions
    if (params.filterDate && params.startDate && params.endDate) {
      whereConditions.push("CAST(o.invoicedate AS datetime) BETWEEN :startDate AND :endDate");
      replacements.startDate = params.startDate;
      replacements.endDate = params.endDate;
    }

    if (params.model) {
      whereConditions.push("bp.model LIKE :model");
      replacements.model = `${params.model}%`;
    }

    if (params.invoicedate) {
      whereConditions.push("o.invoicedate LIKE :invoicedate");
      replacements.invoicedate = `${params.invoicedate}%`;
    }

    if (params.quotenumber) {
      whereConditions.push("o.quotenumber LIKE :quotenumber");
      replacements.quotenumber = `${params.quotenumber}%`;
    }

    if (params.Source) {
      whereConditions.push("o.source = :source");
      replacements.source = params.Source;
    }

    if (params.sourcedescription) {
      whereConditions.push("o.sourcedescription = :sourcedescription");
      replacements.sourcedescription = params.sourcedescription;
    }

    if (params.status) {
      whereConditions.push("o.status = :status");
      replacements.status = params.status;
    }

    if (params.productLine) {
      whereConditions.push("bp.productline = :productLine");
      replacements.productLine = params.productLine;
    }

    if (params.customerNumber) {
      whereConditions.push("c.number LIKE :customerNumber");
      replacements.customerNumber = `${params.customerNumber}%`;
    }

    if (params.customerName) {
      whereConditions.push("CONCAT(c.fname, ' ', c.lname) LIKE :customerName");
      replacements.customerName = `%${params.customerName}%`;
    }

    if (params.company1) {
      whereConditions.push("c.company1 LIKE :company1");
      replacements.company1 = `%${params.company1}%`;
    }

    // Status filters
    if (params.statusFilters?.length > 0) {
      whereConditions.push("o.status IN (:statusFilters)");
      replacements.statusFilters = params.statusFilters;
    }

    // Add where conditions to base query
    if (whereConditions.length > 0) {
      baseQuery += ` AND ${whereConditions.join(" AND ")}`;
    }

    // Use the added orderDate column for sorting
    baseQuery += ` ORDER BY orderDate DESC, o.quotenumber DESC`;

    const results = await sequelize.query(baseQuery, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Remove the extra orderDate column from results
    return results.map(row => {
      const { orderDate, ...rest } = row;
      return rest;
    });

  } catch (error) {
    console.error("Export query error:", error);
    throw error;
  }
};



export const getQuoteNumber = async () => {
  try {
    const [result] = await sequelize.query(
      `
      select  MAX(quotenumber+1) AS quotenumber from tblOrder where quotenumber <> 0
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    // Get the current date
    const invoicedate = new Date();

    // Create a new date for one month later
    const expirationdate = new Date(invoicedate);
    expirationdate.setMonth(invoicedate.getMonth() + 1);
    return {
      quotenumber: result.quotenumber,
      invoicedate,
      expirationdate
    };
  } catch (error) {
    console.error("Error fetching product line:", error.message);
    throw new Error(error.message);
  }
};


export const createOrderOnNoProps = async (data) => {
  const createReqData = {
    ...data,
  };

  const result = await tblOrder.create(createReqData);

  return result;
};

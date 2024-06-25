import { Op } from 'sequelize';
import { tblOrder, tblOrderDetail } from "~/server/models";

export const createOrder = async (data) => {
  try{
    const newOrder = await tblOrder.create(data);
    return newOrder
  }catch(error){
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
}

export const creteOrderDetail = async (data) => {
  try{
    const newOrderDetail = await tblOrderDetail.create(data);
    return newOrderDetail
  }catch(error){
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
}
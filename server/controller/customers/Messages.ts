import { Op } from 'sequelize';
import { tblMessages } from "~/server/models";

const applyFilters = (params) => {
  const filterParams = ['uniqueid', 'date', 'customer', 'vendor', 'name', 'for', 'takenby'];
  const whereClause = {};

  filterParams.forEach(param => {
    if (params[param]) {
      whereClause[param] = {
        [Op.like]: `%${params[param]}%`
      };
    }
  });

  return whereClause;
};

export const messageExistByID = async (id: number | string) => {
  const tableDetail = await tblMessages.findByPk(id);
  if (tableDetail)
    return true;
  else
    return false;
}

export const getMessages = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;

  const whereClause = applyFilters(filterParams);

  const list = await tblMessages.findAll({
    attributes: ['UniqueID', 'DATE', 'CUSTOMER', 'VENDOR', 'NAME', 'FOR', 'TAKENBY'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    offset,
    limit
  });
  return list;
}

export const createMessage = async (data) => {
  const createReqData = {
    ...data,
  };
  const newMessage = await tblMessages.create(createReqData);
  return newMessage
}

export const getNumberOfMessages = async (filterParams) => {
  const whereClause = applyFilters(filterParams);
  const numberOfMessages = await tblMessages.count({
    where: whereClause
  });
  return numberOfMessages;
}

export const customerMessageByID = async (id) => {
  const tableDetail = await tblMessages.findByPk(id);
  if (tableDetail)
    return true;
  else
    return false;
}

export const getMessageDetail = async (id) => {
  const tableDetail = await tblMessages.findByPk(id);
  return tableDetail
}

export const updateMessage = async (id, reqData) => {
  await tblMessages.update(reqData, {
    where: { UniqueID: id }
  });
  return id;
}

export const deleteMessage = async (id) => {
  await tblMessages.destroy({ where: { UniqueID: id } });
  return id;
}
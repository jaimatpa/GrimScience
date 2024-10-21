import { Sequelize, Op } from "sequelize";
import { tblOrder, tblOrderDetail } from "~/server/models";

export const getServiceCalendars = async () => {
  tblOrder.hasMany(tblOrderDetail, { foreignKey: 'orderid' });
  tblOrderDetail.belongsTo(tblOrder, { foreignKey: 'orderid' });
  const serviceCalendars = await tblOrder.findAll({
    attributes: ['UniqueID', 'datepromised', 'InstallationBy'],
    include: [{
      model: tblOrderDetail,
      attributes: ['serial'],
      where: {
        serial: {
          [Op.and]: [
            { [Op.ne]: null },
            { [Op.ne]: '' }
          ]
        }
      },
      required: true
    }],
    where: {
      datepromised: {
        [Op.and]: [
          { [Op.ne]: null },
          { [Op.ne]: '' }
        ]
      }
    },
    raw: true
  })
  const formattedServiceCalendars = serviceCalendars.map((item: any) => {
    return {
      UniqueID: item.UniqueID,
      datepromised: item.datepromised,
      InstallationBy: item.InstallationBy,
      serial: item['tblOrderDetails.serial']
    }
  })
  return formattedServiceCalendars
}

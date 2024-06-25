import { Op, Sequelize } from 'sequelize';
import { tblVendors } from "~/server/models";

export const getShippingMethods = async () => {
  const distinctShippingMethods = await tblVendors.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('SHIPVIA')), 'SHIPVIA']
    ],
    where: {
      [Op.and]: [
        { SHIPVIA: { [Op.ne]: null } },
        { SHIPVIA: { [Op.ne]: '' } }
      ]
    },
    order: [
      ['SHIPVIA', 'ASC'],
    ]
  });

  const shippingMethods = distinctShippingMethods.map(result => result.get('SHIPVIA'));

  return shippingMethods;
}

import { Sequelize, Op } from 'sequelize';
import { tblState, tblCustomers } from "~/server/models";

export const getStateList = async () => {
  let result;
  // let result = await tblState.findAll({
  //   attributes: [
  //     [Sequelize.fn('DISTINCT', Sequelize.col('state')), 'state']
  //   ],
  // });
  // if(!result.length) {
  result = await tblCustomers.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('state')), 'state']
    ],
    where: {
      [Op.and]: [
        { state: { [Op.ne]: null } },
        { state: { [Op.ne]: '' } }
      ]
    },
    order: [['state', 'ASC']],
    raw: true
  });
  // }
  const distinctStates = result.map((item: any) => item.state);
  return distinctStates
}


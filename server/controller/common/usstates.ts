import { Sequelize } from 'sequelize';
import { tblState } from "~/server/models";

export const getStateList = async () => {
  const result = await tblState.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('state')), 'state']
    ],
  });
  
  const distinctStates = result.map((item: any) => item.state);
  return distinctStates
}


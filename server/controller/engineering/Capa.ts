import { Op, Sequelize } from 'sequelize'
import { tblPreventiveActions } from '~/server/models'

const applyFilters = (params) => {
  const filterParams = ['PANO', 'PRODLINE', 'ACTIONTYPE', 'DESCRIPTION']
  const whereClause = {}

  filterParams.forEach((param) => {
    if (params[param]) {
      whereClause[param] = {
        [Op.like]: `%${params[param]}%`
      }
    }
  })

  return whereClause
}

export const getCapas = async (params) => {
  const { PANO, PRODLINE, DIAGDATE, ACTIONTYPE, DESCRIPTION, chkOpenOnly } = params

  // Iterate over the keys of the params object
  const whereClause = applyFilters(params)

  // Handle chkOpenOnly filtering
  if (chkOpenOnly == 'true') {
    whereClause['Status'] = {
      [Op.like]: 'Open'
    }
  }

  // Fetch the data from the table
  const list = await tblPreventiveActions.findAll({
    attributes: [
      'uniqueID',
      'PANO',
      'PRODLINE',
      [Sequelize.fn('FORMAT', Sequelize.col('DIAGDATE'), 'MM/dd/yyyy'), 'DIAGDATE'],
      'ACTIONTYPE',
      'DESCRIPTION'
    ],
    where: whereClause,
    order: [['PANO', 'ASC']]
  })

  return list
}

export const getCapaDetail = async (id) => {
    console.log('id', id)
    const capaDetail = await tblPreventiveActions.findByPk(id)
    
    console.log('capaDetail', capaDetail)
  return capaDetail;
}

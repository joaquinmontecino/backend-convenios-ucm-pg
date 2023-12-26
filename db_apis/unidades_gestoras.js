const database = require('../services/database.js');
const queries = require('../queries/unidades_gestoras.js');

async function find(target) {
  let query = queries.baseSelectQuery;
  const binds = [];

  if (target.id) {
    binds[0]= target.id;
    query += `\nWHERE ID_UNIDAD_GESTORA = $1`;
  }else{
    query += `\nORDER BY ID_UNIDAD_GESTORA`;
  }
  const result = await database.simpleExecute(query, binds);

  return result;
}

async function create(unidad) {
  const unidad_gestora = Object.values(unidad);
  
  const result = await database.simpleExecute(queries.createQuery, unidad_gestora);
  
  unidad_gestora[2] = result[0].id_unidad_gestora;
  
  return unidad_gestora;
}


async function update(unidad) {
  const unidad_gestora = Object.values(unidad);
  const result = await database.simpleExecute(queries.updateQuery, unidad_gestora);
  const rowsAffected = result[0].rows_affected;
  delete result[0].rows_affected;

  if (result.length ==1 && rowsAffected >= 1) {
    return result[0];
  } else {
    return null;
  }
}


async function del(id) {
  try{
    const result = await database.simpleExecute(queries.deleteQuery, [id]);
    const rowsAffected = result[0].rows_affected;
    delete result[0].rows_affected;
    if (result.length ==1 && rowsAffected >= 1) {
      return true;
    } else {
      throw error;
    }
  } catch(error){
    return false;
  }
}

module.exports.find = find;  
module.exports.create = create;
module.exports.update = update;
module.exports.delete = del;
const database = require('../services/database.js');
const queries = require('../queries/instituciones.js');

async function find(target) {
  let query = queries.baseSelectQuery;
  const binds = [];

  if (target.id) {
    binds[0]= target.id;

    query += `\nWHERE ID_INSTITUCION = $1`;
  }else {
    query += `\nORDER BY ID_INSTITUCION`;
  }

  const result = await database.simpleExecute(query, binds);

  return result;
}

async function create(inst) {
  const institucion = Object.values(inst);

  const result = await database.simpleExecute(queries.createQuery, institucion);
  institucion[4] = result[0].id_institucion;
  
  return institucion;
}

async function update(inst) {
  const institucion = Object.values( inst);
  const result = await database.simpleExecute(queries.updateQuery, institucion);
  const rowsAffected = result[0].rows_affected;
  delete result[0].rows_affected;

  if (result.length ==1 && rowsAffected >= 1) {
    return result[0];
  } else {
    return null;
  }
}

async function del(id){
  try{
    console.log(database.simpleExecute(queries.deleteQuery, [id]));
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

async function listarNombres(){
  const result = await database.simpleExecute(queries.listarPorNombresQuery, []);
  return result;
}


module.exports.find = find;
module.exports.create = create;
module.exports.update = update;
module.exports.delete = del;
module.exports.listarNombres = listarNombres;



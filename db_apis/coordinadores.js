const database = require('../services/database.js');
const queries = require('../queries/coordinadores.js');

async function find(target) {
  let query = queries.baseSelectQuery;
  const binds = [];

  if (target.id) {
    binds[0] = target.id;
    query += `\nWHERE ID_COORDINADOR = $1`;
  } else {
    query += `\nORDER BY ID_COORDINADOR`;
  }
  const result = await database.simpleExecute(query, binds);

  return result;
}

async function create(coord) {
  const coordinador = Object.values(coord);
  
  const result = await database.simpleExecute(queries.createQuery, coordinador);
  coordinador[4] = result[0].id_coordinador;
  
  return coordinador;
}

async function update(coord) {
  const coordinador = Object.values(coord);
  const result = await database.simpleExecute(queries.updateQuery, coordinador);
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

async function listarNombres(){
  const result = await database.simpleExecute(queries.listarNombresQuery, []);
  return result;
}

async function listarCoordinadoresInternos(){
  const result = await database.simpleExecute(queries.listarCoordinadoresInternosQuery, []);
  return result;
}

module.exports.find = find;  
module.exports.create = create;
module.exports.update = update;
module.exports.delete = del;
module.exports.listarNombres = listarNombres;
module.exports.listarCoordinadoresInternos = listarCoordinadoresInternos;
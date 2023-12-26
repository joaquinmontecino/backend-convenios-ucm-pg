const database = require('../services/database.js');
const queries = require('../queries/usuarios.js');

async function create (user){
  const usuario = Object.values(user);
  
  const result = await database.simpleExecute(queries.createQuery, usuario);
  usuario[6] = result[0].id_usuario;
  return usuario;
}

async function authenticate(credentials){
  const credenciales = Object.values(credentials);
  const result = await database.simpleExecute(queries.authenticateQuery, credenciales);
  if (result.length == 1) {
    return result[0];
  } else {
    return null;
  }
}

async function find(target){
  let query = queries.selectQuerySinID;
  const binds = [];

  if (target.id){
    binds[0] = target.id;
    query = queries.selectQueryConID;
  }

  const result = await database.simpleExecute(query, binds);
  return result;
}

async function update(user) {
  const usuario = Object.values(user);
  const result = await database.simpleExecute(queries.updateQuery, usuario);
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

module.exports.authenticate = authenticate;
module.exports.create = create;
module.exports.find = find;
module.exports.update = update;
module.exports.delete = del;


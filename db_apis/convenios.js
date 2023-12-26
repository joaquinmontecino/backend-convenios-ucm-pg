const database = require('../services/database.js');
const queries = require('../queries/convenios.js');

async function find(target) {
  let query = queries.baseSelectQuery;
  const binds = [];

  if (target.id) {
    binds[0] = target.id;

    query += `\nWHERE C.ID_CONVENIO = $1`;
  }else {
    query += `\nORDER BY C.ID_CONVENIO`;
  }


  const result = await database.simpleExecute(query, binds);

  return result;
}

async function create(data) {
  const convenio = Object.values(data);

  const id_coordinador_externo_bind = convenio[1];
  const id_coordinador_interno_bind = convenio[2];
  convenio.splice(1, 2);
  
  const result = await database.simpleExecute(queries.createQuery, convenio);
    
  convenio[13] = result[0].id_convenio;  

  await database.simpleExecute(queries.queryInsertDetalleCoordinadorExterno, [convenio[13], id_coordinador_externo_bind]);
  await database.simpleExecute(queries.queryInsertDetalleCoordinadorInterno, [convenio[13], id_coordinador_interno_bind]);

  return convenio;
}

async function update(conv) {
  const convenio = Object.values(conv);  
  convenio.splice(1, 2);    

  const result = await database.simpleExecute(queries.updateQuery, convenio);
  const rowsAffected = result[0].rows_affected;
  delete result[0].rows_affected;

  if (result.length == 1 && rowsAffected >= 1) {
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



function construirQueryDinamica(criteria){
  let query = 'SELECT C.* FROM CONVENIO C';
  query+= ' LEFT JOIN UNIDAD_GESTORA UG ON C.ID_UNIDAD_GESTORA = UG.ID_UNIDAD_GESTORA'
  query += ' LEFT JOIN INSTITUCION I ON UG.ID_INSTITUCION = I.ID_INSTITUCION';
  let whereClause = '';
  const binds = {};
  if (criteria.id_institucion || criteria.id_unidad_gestora){
    whereClause += ' WHERE';
    
    if (criteria.id_institucion && criteria.id_unidad_gestora) {
      whereClause += ' (UG.ID_INSTITUCION = :id_institucion OR UG.ID_UNIDAD_GESTORA = :id_unidad_gestora)';
      binds.id_institucion = criteria.id_institucion;
      binds.id_unidad_gestora = criteria.id_unidad_gestora;
    }
    else{
      if (criteria.id_institucion){
        whereClause += ' UG.ID_INSTITUCION = :id_institucion';
        binds.id_institucion = criteria.id_institucion;
      }
      if(criteria.id_unidad_gestora){
        whereClause +=' UG.ID_UNIDAD_GESTORA = :id_unidad_gestora';
        binds.id_unidad_gestora = criteria.id_unidad_gestora;
      }
    }
  }

  if (criteria.tipo_conv){
    whereClause += `${whereClause.length > 0 ? ' AND' : ' WHERE'} C.TIPO_CONV = :tipo_conv`;
    binds.tipo_conv = criteria.tipo_conv;
  }
  
  if (criteria.movilidad){
    whereClause += `${whereClause.length > 0 ? ' AND' : ' WHERE'} C.MOVILIDAD = :movilidad`;
    binds.movilidad = criteria.movilidad;
  }
  
  if (criteria.ano_firma){
    whereClause += `${whereClause.length > 0 ? ' AND' : ' WHERE'} C.ANO_FIRMA = :ano_firma`;
    binds.ano_firma = criteria.ano_firma; 
  }
  
  if (criteria.tipo_firma){
    whereClause += `${whereClause.length > 0 ? ' AND' : ' WHERE'} C.TIPO_FIRMA = :tipo_firma`;
    binds.tipo_firma = criteria.tipo_firma;
  }
  
  if (criteria.estatus){
    whereClause += `${whereClause.length > 0 ? ' AND' : ' WHERE'} C.ESTATUS = :estatus`;
    binds.estatus = criteria.estatus;
  }

  if (criteria.fecha_termino){
    whereClause += `${whereClause.length > 0 ? ' AND ' : ' WHERE'} C.FECHA_TERMINO = :fecha_termino`;
    binds.fecha_termino = criteria.fecha_termino;
  }

  if (criteria.pais){
    whereClause += `${whereClause.length > 0 ? ' AND ' : ' WHERE'} I.PAIS = :pais`;
    binds.pais = criteria.pais;
  }


  if (criteria.alcance){
    whereClause += `${whereClause.length > 0 ? ' AND ' : ' WHERE'} I.ALCANCE = :alcance`;
    binds.alcance = criteria.alcance;
  }


  query += whereClause;
  return {query, binds};
}



async function seleccionCriterios(criteria){
  console.log('Criteria: ');
  console.log(criteria);
  const {query, binds} = construirQueryDinamica(criteria);
  console.log(query);
  const result = await database.simpleExecute(query, binds);
  return result;

}


module.exports.find = find;  
module.exports.create = create;
module.exports.update = update;
module.exports.delete = del;
module.exports.seleccionCriterios = seleccionCriterios;














/*
 const createSQLCRUD2 = `
  BEGIN
    SELECT id_convenio_out INTO :id_convenio
      FROM CREATE_CONVENIO(0,:nombre_conv,:tipo_conv,:vigencia,:ano_firma,:tipo_firma,:cupos,:documentos);
  END;
`;

const createSql = `insert into convenio (id_convenio,nombre_conv,tipo_conv,vigencia,ano_firma,tipo_firma,cupos,documentos) values (0,:nombre_conv,:tipo_conv,:vigencia,:ano_firma,:tipo_firma,:cupos,:documentos) returning id_convenio into :id_convenio`;
 */

const baseSelectQuery = 
 `SELECT ID_UNIDAD_GESTORA "ID_Unidad_Gestora",
    ID_INSTITUCION "ID_Institucion",
    NOMBRE_UNIDAD "Nombre_Unidad_Gestora"
  FROM UNIDAD_GESTORA`;

const createQuery = `
  INSERT INTO UNIDAD_GESTORA (ID_INSTITUCION, NOMBRE_UNIDAD)
    VALUES ($1, $2) RETURNING ID_UNIDAD_GESTORA`;

const updateQuery = `
  WITH updated_unidad AS(
    UPDATE UNIDAD_GESTORA
    SET
      ID_INSTITUCION = COALESCE($1, ID_INSTITUCION),
      NOMBRE_UNIDAD = COALESCE($2, NOMBRE_UNIDAD)
    WHERE ID_UNIDAD_GESTORA = $3
    RETURNING *
  )
  SELECT
    (SELECT COUNT(*) FROM updated_unidad) AS rows_affected, u.*
  FROM updated_unidad u`;

const deleteQuery = `
  WITH deleted_convenio AS (
    DELETE FROM CONVENIO
    WHERE ID_UNIDAD_GESTORA = $1
    RETURNING ID_CONVENIO
  ),
  deleted_detalle AS (
    DELETE FROM DETALLE_CONVENIO_COORDINADOR
    WHERE ID_CONVENIO IN (SELECT ID_CONVENIO FROM deleted_convenio)
  ),
  deleted_unidad AS (
    DELETE FROM UNIDAD_GESTORA
    WHERE ID_UNIDAD_GESTORA = $1
    RETURNING *
  )
  SELECT
    (SELECT COUNT(*) FROM deleted_unidad) as rows_affected, u.*
  FROM deleted_unidad u`;

module.exports = {
  baseSelectQuery,
  createQuery,
  updateQuery,
  deleteQuery
};
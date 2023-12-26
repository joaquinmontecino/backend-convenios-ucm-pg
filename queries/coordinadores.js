const baseSelectQuery = 
 `SELECT ID_COORDINADOR "ID_Coordinador",
    ID_INSTITUCION "ID_Institucion",
    TIPO "Tipo_Coordinador",
    NOMBRE "Nombre",
    CORREO "Correo"
  FROM COORDINADOR`;

const createQuery = `
  INSERT INTO COORDINADOR (ID_INSTITUCION, TIPO, NOMBRE, CORREO)
    VALUES($1, $2, $3, $4) RETURNING ID_COORDINADOR`;

const updateQuery = `
  WITH updated_coordinador AS(
    UPDATE COORDINADOR
    SET
      ID_INSTITUCION = COALESCE($1, ID_INSTITUCION),
      TIPO = COALESCE($2, TIPO),
      NOMBRE = COALESCE($3, NOMBRE),
      CORREO = COALESCE($4, CORREO)
    WHERE ID_COORDINADOR = $5
    RETURNING *
  )
  SELECT
    (SELECT COUNT(*) FROM updated_coordinador) AS rows_affected, c.*
  FROM updated_coordinador c`;

const deleteQuery =`
  WITH deleted_coordinador AS (
    DELETE FROM COORDINADOR
    WHERE ID_COORDINADOR = $1
    RETURNING *
  )
  SELECT
    (SELECT COUNT(*) FROM deleted_coordinador) as rows_affected, c.*
  FROM deleted_coordinador c`;

const listarNombresQuery = 
  `SELECT ID_COORDINADOR "ID_Coordinador", NOMBRE "Nombre"
  FROM COORDINADOR
  ORDER BY ID_COORDINADOR`;

const listarCoordinadoresInternosQuery = 
  `SELECT ID_COORDINADOR "ID_Coordinador", NOMBRE "Nombre"
  FROM COORDINADOR
  WHERE TIPO = 'Interno'`;

module.exports = {
  baseSelectQuery,
  createQuery,
  updateQuery,
  deleteQuery,
  listarNombresQuery,
  listarCoordinadoresInternosQuery
};
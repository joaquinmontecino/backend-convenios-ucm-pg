
const baseSelectQuery = 
  `SELECT ID_INSTITUCION "id",
  NOMBRE_INST "Nombre_Institucion",
  PAIS "Pais",
  ALCANCE "Alcance",
  TIPO_INSTITUCION "Tipo_Institucion"
  FROM INSTITUCION`;

const createQuery = `
  INSERT INTO INSTITUCION (NOMBRE_INST, PAIS, ALCANCE, TIPO_INSTITUCION) 
    VALUES ($1, $2, $3, $4) RETURNING ID_INSTITUCION`;

const updateQuery = `
  WITH updated_institucion AS(
    UPDATE INSTITUCION
    SET
      NOMBRE_INST = COALESCE($1, NOMBRE_INST),
      PAIS = COALESCE($2, PAIS),
      ALCANCE = COALESCE($3, ALCANCE),
      TIPO_INSTITUCION = COALESCE($4, TIPO_INSTITUCION)
    WHERE ID_INSTITUCION = $5
    RETURNING *
  )
  SELECT
    (SELECT COUNT(*) FROM updated_institucion) as rows_affected, i.*
  FROM updated_institucion i`;

const deleteQuery = `
WITH deleted_unidad AS (
  DELETE FROM UNIDAD_GESTORA
  WHERE ID_INSTITUCION = $1
  RETURNING ID_UNIDAD_GESTORA
),
deleted_convenio AS (
  DELETE FROM CONVENIO
  WHERE ID_UNIDAD_GESTORA IN (SELECT ID_UNIDAD_GESTORA FROM deleted_unidad)
  RETURNING ID_CONVENIO
),
deleted_coordinador AS (
  DELETE FROM COORDINADOR
  WHERE (ID_INSTITUCION = $1) AND (TIPO = 'Externo')
  RETURNING ID_COORDINADOR
),
deleted_detalle AS (
  DELETE FROM DETALLE_CONVENIO_COORDINADOR
  WHERE ID_CONVENIO IN (SELECT ID_CONVENIO FROM deleted_convenio) OR
        ID_COORDINADOR IN (SELECT ID_COORDINADOR FROM deleted_coordinador)
),
deleted_institucion AS (
  DELETE FROM INSTITUCION
  WHERE ID_INSTITUCION = $1
  RETURNING *
)
SELECT
  (SELECT COUNT(*) FROM deleted_institucion) as rows_affected,
  i.*
FROM deleted_institucion i;`;

const listarPorNombresQuery = 
  `SELECT ID_INSTITUCION "ID_Institucion", NOMBRE_INST "Nombre_Institucion"
  FROM INSTITUCION
  WHERE ID_INSTITUCION != 1
  ORDER BY ID_INSTITUCION`;

module.exports = {
  baseSelectQuery,
  createQuery,
  updateQuery,
  deleteQuery,
  listarPorNombresQuery
};
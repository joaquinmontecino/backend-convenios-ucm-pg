const baseSelectQuery = 
 `SELECT
    C.ID_CONVENIO "ID_Convenio",
    C.NOMBRE_CONV "Nombre_Convenio",
    C.TIPO_CONV "Tipo_Convenio",
    C.MOVILIDAD "Movilidad",
    C.VIGENCIA "Vigencia",
    C.ANO_FIRMA "Anio_Firma",
    C.TIPO_FIRMA "Tipo_Firma",
    C.CUPOS "Cupos",
    C.DOCUMENTOS "Documentos",
    C.CONDICION_RENOVACION "Condicion_Renovacion",
    C.ESTATUS "Estatus",
    TO_CHAR(C.FECHA_INICIO, 'DD/MM/YY') "Fecha_Inicio",
    TO_CHAR(C.FECHA_TERMINO, 'DD/MM/YY') "Fecha_Termino",
    I.ID_INSTITUCION "ID_Institucion",
    I.NOMBRE_INST "Nombre_Institucion",
    UG.ID_UNIDAD_GESTORA "ID_Unidad_Gestora",
    UG.NOMBRE_UNIDAD "Nombre_Unidad_Gestora",
    I.PAIS "Pais",
    I.ALCANCE "Alcance",
    I.TIPO_INSTITUCION "Tipo_Institucion",
    COE.ID_COORDINADOR "ID_Coordinador_Externo",
    COE.TIPO "Tipo_Coordinador_Externo",
    COE.NOMBRE "Nombre_Coordinador_Externo",
    COE.CORREO "Correo_Coordinador_Externo",
    COI.ID_COORDINADOR "ID_Coordinador_Interno",
    COI.TIPO "Tipo_Coordinador_Interno",
    COI.NOMBRE "Nombre_Coordinador_Interno",
    COI.CORREO "Correo_Coordinador_Interno"
    FROM
      CONVENIO C
    JOIN
      UNIDAD_GESTORA UG ON C.ID_UNIDAD_GESTORA = UG.ID_UNIDAD_GESTORA
    JOIN
      INSTITUCION I ON UG.ID_INSTITUCION = I.ID_INSTITUCION
    LEFT JOIN (
        SELECT
            DCC.ID_CONVENIO,
            CO.ID_COORDINADOR AS ID_COORDINADOR,
            CO.TIPO AS TIPO,
            CO.NOMBRE AS NOMBRE,
            CO.CORREO AS CORREO
        FROM
            DETALLE_CONVENIO_COORDINADOR DCC
        JOIN
            COORDINADOR CO ON DCC.ID_COORDINADOR = CO.ID_COORDINADOR AND CO.TIPO = 'Externo'
    ) COE ON C.ID_CONVENIO = COE.ID_CONVENIO
    LEFT JOIN (
      SELECT
          DCC.ID_CONVENIO,
          CO.ID_COORDINADOR AS ID_COORDINADOR,
          CO.TIPO AS TIPO,
          CO.NOMBRE AS NOMBRE,
          CO.CORREO AS CORREO
      FROM
          DETALLE_CONVENIO_COORDINADOR DCC
      JOIN
          COORDINADOR CO ON DCC.ID_COORDINADOR = CO.ID_COORDINADOR AND CO.TIPO = 'Interno'
  ) COI ON C.ID_CONVENIO = COI.ID_CONVENIO`;

const createQuery = `
  INSERT INTO CONVENIO (ID_UNIDAD_GESTORA, NOMBRE_CONV, TIPO_CONV, MOVILIDAD, VIGENCIA, ANO_FIRMA, TIPO_FIRMA, CUPOS, DOCUMENTOS, CONDICION_RENOVACION, ESTATUS, FECHA_INICIO, FECHA_TERMINO)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING ID_CONVENIO`;

const queryInsertDetalleCoordinadorExterno = `INSERT INTO detalle_convenio_coordinador (id_convenio, id_coordinador) VALUES($1, $2)`;

const queryInsertDetalleCoordinadorInterno = `INSERT INTO detalle_convenio_coordinador (id_convenio, id_coordinador) VALUES($1, $2)`;

const updateQuery = `
  WITH updated_convenio AS(
    UPDATE CONVENIO
    SET
      ID_UNIDAD_GESTORA = COALESCE($1, ID_UNIDAD_GESTORA),
      NOMBRE_CONV = COALESCE($2, NOMBRE_CONV),
      TIPO_CONV = COALESCE($3, TIPO_CONV),
      MOVILIDAD = COALESCE($4, MOVILIDAD),
      VIGENCIA = COALESCE($5, VIGENCIA),
      ANO_FIRMA = COALESCE($6, ANO_FIRMA),
      TIPO_FIRMA = COALESCE($7, TIPO_FIRMA),
      CUPOS = COALESCE($8, CUPOS),
      DOCUMENTOS = COALESCE($9, DOCUMENTOS),
      CONDICION_RENOVACION = COALESCE($10, CONDICION_RENOVACION),
      ESTATUS = COALESCE($11, ESTATUS),
      FECHA_INICIO = COALESCE($12, FECHA_INICIO),
      FECHA_TERMINO = COALESCE($13, FECHA_TERMINO)
    WHERE ID_CONVENIO = $14
    RETURNING *
  )
  SELECT
    (SELECT COUNT(*) FROM updated_convenio) AS rows_affected, c.*
  FROM updated_convenio c`;

  const deleteQuery = `
  WITH deleted_detalles AS(
    DELETE FROM DETALLE_CONVENIO_COORDINADOR
    WHERE ID_CONVENIO = $1
    RETURNING *
  ),
  deleted_convenio AS (
    DELETE FROM CONVENIO
    WHERE ID_CONVENIO = $1
    RETURNING *
  )
  SELECT
    (SELECT COUNT(*) FROM deleted_convenio) as rows_affected,
    c.*
  FROM deleted_convenio c;`;

module.exports = {
  baseSelectQuery,
  createQuery,
  queryInsertDetalleCoordinadorExterno,
  queryInsertDetalleCoordinadorInterno,
  updateQuery,
  deleteQuery
};
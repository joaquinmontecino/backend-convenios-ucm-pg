const createQuery = `INSERT INTO USUARIO (EMAIL, CONTRASENA, NOMBRE, APELLIDO, VIGENCIA, PRIVILEGIOS) 
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID_USUARIO`;

const authenticateQuery = `
  SELECT ID_USUARIO, EMAIL, PRIVILEGIOS
    FROM USUARIO
    WHERE EMAIL = $1 AND CONTRASENA = $2`;

const selectQueryConID = `
  SELECT EMAIL "Email", NOMBRE "Nombre",
    APELLIDO "Apellido"
    FROM USUARIO
    WHERE ID_USUARIO = $1`;

const selectQuerySinID = `
  SELECT ID_USUARIO "ID_Usuario",
    EMAIL "Email",
    CONTRASENA "Contrasena",
    NOMBRE "Nombre",
    APELLIDO "Apellido",
    VIGENCIA "Vigencia",
    PRIVILEGIOS "Privilegios"
    FROM USUARIO
    ORDER BY ID_USUARIO`;

const updateQuery = `
    WITH updated_usuario AS (
      UPDATE USUARIO 
      SET
        EMAIL = COALESCE($1, EMAIL),
        CONTRASENA = COALESCE($2, CONTRASENA),
        NOMBRE = COALESCE($3, NOMBRE),
        APELLIDO = COALESCE($4, APELLIDO),
        VIGENCIA = COALESCE($5, VIGENCIA),
        PRIVILEGIOS = COALESCE($6, PRIVILEGIOS)        
      WHERE ID_USUARIO = $7
      RETURNING *
    )
    SELECT
      (SELECT COUNT(*) FROM updated_usuario) as rows_affected,
      u.*
    FROM updated_usuario u`;

const deleteQuery = `
  WITH deleted_usuario AS (
    DELETE FROM USUARIO
    WHERE ID_USUARIO = $1
    RETURNING *
  )
  SELECT
    (SELECT COUNT(*) FROM deleted_usuario) as rows_affected,
    u.*
  FROM deleted_usuario u;`;

module.exports = {
  createQuery,
  authenticateQuery,
  selectQueryConID,
  selectQuerySinID,
  updateQuery,
  deleteQuery,
};
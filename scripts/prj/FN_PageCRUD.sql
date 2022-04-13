CREATE OR REPLACE FUNCTION prj.FN_PageCRUD (
  _operation INT,

  _name    VARCHAR(255) = NULL,
  _icon    VARCHAR(60)  = NULL,
  _parent  VARCHAR(36)  = NULL,

  _id        VARCHAR(36)  = NULL,
  _updateVal VARCHAR      = NULL,
  _updateCol VARCHAR(256) = NULL

) RETURNS TABLE (id varchar(36), name varchar(255), icon varchar(60), content varchar, parent varchar(36))
AS $$
BEGIN
  IF _operation = 1 THEN
    INSERT INTO prj.pages (id, name, icon, content, parent)
      VALUES (uuid_generate_v4(), _name, _icon, '', _parent);

  ELSIF _operation = 2 THEN
    RETURN QUERY
    SELECT page.id, page.name, page.icon, page.content, page.parent
    FROM prj.pages AS page
    ORDER BY page.name ASC;

  ELSIF _operation = 3 THEN
    EXECUTE FORMAT('UPDATE prj.pages SET %I = $1::%s WHERE prj.pages.id = $2', _updateCol, (SELECT data_type FROM information_schema.columns WHERE table_name = 'pages' AND column_name = _updateCol))
      USING _updateVal, _id;

  ELSIF _operation = 4 THEN
    DELETE FROM prj.pages WHERE prj.pages.id = _id;

  END IF;
END; $$
LANGUAGE plpgsql;

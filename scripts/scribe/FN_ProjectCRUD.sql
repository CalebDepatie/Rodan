CREATE OR REPLACE FUNCTION prj.FN_ProjectCRUD (
    _operation INT,

    _name        VARCHAR(128) = NULL,
    _description varchar(256) = NULL,
    _status      INT          = NULL,
    _parent      INT          = NULL,

    _projectID    INT = NULL,
    _initiativeID INT = NULL,

    _updateVal VARCHAR(256) = NULL,
    _updateCol VARCHAR(256) = NULL
) RETURNS TABLE (id INTEGER, name VARCHAR(128), description VARCHAR(256), created_date FLOAT, status INTEGER, parent INTEGER)
AS $$
DECLARE _sql VARCHAR(512);
BEGIN
  IF    _operation = 1 THEN
    IF _parent = NULL THEN
      INSERT INTO prj.projects (name, description, created_date, status)
        VALUES (_name, _description, NOW()::DATE, _status);
    ELSE
      INSERT INTO prj.initiatives (name, description, created_date, status, parent)
        VALUES (_name, _description, NOW()::DATE, _status, _parent);
    END IF;
  ELSIF _operation = 2 THEN
    RETURN QUERY
    SELECT PRJ.id, PRJ.name, PRJ.description, PRJ.created_date, PRJ.status, PRJ.parent
      FROM prj.VV_Projects AS PRJ;

  ELSIF _operation = 3 THEN
    IF _projectID <> NULL THEN
      SELECT _sql = 'UPDATE prj.projects SET [' + _updateCol + '] = ''' + _updateVal + ''' WHERE [id] = '''+ _projectID + '''';
      EXECUTE(_sql);
    ELSE
      SELECT _sql = 'UPDATE prj.initiatives SET [' + _updateCol + '] = ''' + _updateVal + ''' WHERE [id] = '''+ _initiativeID + '''';
      EXECUTE(_sql);
    END IF;
  ELSIF _operation = 4 THEN
    IF _projectID <> NULL THEN
      DELETE FROM prj.projects WHERE id = _projectID;
    ELSE
      DELETE FROM prj.initiatives WHERE id = _initiativeID;
    END IF;
  END IF;
END; $$
LANGUAGE plpgsql;

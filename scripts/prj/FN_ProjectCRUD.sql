CREATE OR REPLACE FUNCTION prj.FN_ProjectCRUD (
    _operation INT,

    _name        VARCHAR(128) = NULL,
    _description varchar(256) = NULL,
    _status      INT          = NULL,
    _parent      INT          = 0,

    _projectID    INT = NULL,
    _initiativeID INT = NULL,

    _updateVal VARCHAR(256) = NULL,
    _updateCol VARCHAR(256) = NULL
) RETURNS TABLE (id INT, name VARCHAR(128), description VARCHAR(256), created_date FLOAT, status INT, parent INT)
AS $$
BEGIN
  IF _operation = 1 THEN
    IF _parent = 0 THEN
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
    IF _projectID IS NOT NULL THEN
      EXECUTE FORMAT('UPDATE prj.projects SET %I = $1::%s WHERE prj.projects.id = $2', _updateCol, (SELECT data_type FROM information_schema.columns WHERE table_name = 'projects' AND column_name = _updateCol))
        USING _updateVal, _projectID;
    ELSE
      EXECUTE FORMAT('UPDATE prj.initiatives SET %I = $1::%s WHERE prj.initiatives.id = $2', _updateCol, (SELECT data_type FROM information_schema.columns WHERE table_name = 'initiatives' AND column_name = _updateCol))
        USING _updateVal, _initiativeID;
    END IF;

  ELSIF _operation = 4 THEN
    IF _projectID IS NOT NULL THEN
      DELETE FROM prj.projects WHERE prj.projects.id = _projectID;
    ELSE
      DELETE FROM prj.initiatives WHERE prj.initiatives.id = _initiativeID;
    END IF;
  END IF;
END; $$
LANGUAGE plpgsql;

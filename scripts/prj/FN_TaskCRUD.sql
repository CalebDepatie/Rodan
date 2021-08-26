CREATE OR REPLACE FUNCTION prj.FN_TaskCRUD (
    _operation INT,

    _title       VARCHAR(255) = NULL,
    _description VARCHAR      = NULL,
    _activity    VARCHAR(36)  = NULL,

    _taskID    VARCHAR(36)  = NULL,
    _updateVal VARCHAR(256) = NULL,
    _updateCol VARCHAR(256) = NULL
) RETURNS TABLE (id varchar(36), title varchar(255), description varchar, status integer, activity varchar(36), created_date float)
AS $$
BEGIN
  IF _operation = 1 THEN
    INSERT INTO prj.tasks (id, title, description, activity, created_date)
      VALUES (uuid_generate_v4(), _title, _description, _activity, NOW()::DATE);

  ELSIF _operation = 2 THEN
    RETURN QUERY
    SELECT TSK.id, TSK.title, COALESCE(TSK.description, ''), TSK.status, COALESCE(TSK.activity, ''), EXTRACT(EPOCH FROM TSK.created_date)
      FROM prj.tasks AS TSK;

  ELSIF _operation = 3 THEN
    EXECUTE FORMAT('UPDATE prj.tasks SET %I = $1::%s WHERE prj.tasks.id = $2', _updateCol, (SELECT data_type FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = _updateCol))
      USING _updateVal, _taskID;

  ELSIF _operation = 4 THEN
    DELETE FROM prj.tasks WHERE prj.tasks.id = _taskID;

  END IF;
END; $$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION prj.FN_ProjectsUpdateLog()
  RETURNS TRIGGER
AS $$
BEGIN
  /* Niavely check each field. Probably a more dynamic way to do this */
  IF NEW.name <> OLD.name THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES (NEW.name, NEW.id, uuid_generate_v4(), 'projects', 'name', NOW()::DATE);
  END IF;

  IF NEW.description <> OLD.description THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES (NEW.description, NEW.id, uuid_generate_v4(), 'projects', 'description', NOW()::DATE);
  END IF;

  IF NEW.status <> OLD.status THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES (NEW.status, NEW.id, uuid_generate_v4(), 'projects', 'status', NOW()::DATE);
  END IF;

  RETURN NEW;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER TR_ProjectsUpdateLog
  AFTER UPDATE
  ON prj.projects
  FOR EACH ROW
  EXECUTE PROCEDURE prj.FN_ProjectsUpdateLog();

CREATE OR REPLACE FUNCTION prj.FN_ProjectsCreateLog()
  RETURNS TRIGGER
AS $$
BEGIN
  INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES
    (NEW.name, NEW.id, uuid_generate_v4(), 'projects', 'name', NOW()::DATE),
    (NEW.description, NEW.id, uuid_generate_v4(), 'projects', 'description', NOW()::DATE),
    (NEW.status, NEW.id, uuid_generate_v4(), 'projects', 'status', NOW()::DATE);

  RETURN NEW;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER TR_ProjectsCreateLog
  AFTER INSERT
  ON prj.projects
  FOR EACH ROW
  EXECUTE PROCEDURE prj.FN_ProjectsCreateLog();

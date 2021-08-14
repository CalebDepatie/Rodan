CREATE OR REPLACE FUNCTION prj.FN_InitiativesUpdateLog()
  RETURNS TRIGGER
AS $$
BEGIN
  /* Niavely check each field. Probably a more dynamic way to do this */
  IF NEW.name <> OLD.name THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES (NEW.name, NEW.id, uuid_generate_v4(), 'initiatives', 'name', NOW()::DATE);
  END IF;

  IF NEW.description <> OLD.description THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES (NEW.description, NEW.id, uuid_generate_v4(), 'initiatives', 'description', NOW()::DATE);
  END IF;

  IF NEW.status <> OLD.status THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES (NEW.status, NEW.id, uuid_generate_v4(), 'initiatives', 'status', NOW()::DATE);
  END IF;

  IF NEW.parent <> OLD.parent THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES (NEW.parent, NEW.id, uuid_generate_v4(), 'initiatives', 'parent', NOW()::DATE);
  END IF;

  RETURN NEW;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER TR_InitiativesUpdateLog
  AFTER UPDATE
  ON prj.initiatives
  FOR EACH ROW
  EXECUTE PROCEDURE prj.FN_InitiativesUpdateLog();

CREATE OR REPLACE FUNCTION prj.FN_InitiativesCreateLog()
  RETURNS TRIGGER
AS $$
BEGIN
  INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES
    (NEW.name, NEW.id, uuid_generate_v4(), 'initiatives', 'name', NOW()::DATE),
    (NEW.description, NEW.id, uuid_generate_v4(), 'initiatives', 'description', NOW()::DATE),
    (NEW.parent, NEW.id, uuid_generate_v4(), 'initiatives', 'parent', NOW()::DATE),
    (NEW.status, NEW.id, uuid_generate_v4(), 'initiatives', 'status', NOW()::DATE);

  RETURN NEW;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER TR_InitiativesCreateLog
  AFTER INSERT
  ON prj.initiatives
  FOR EACH ROW
  EXECUTE PROCEDURE prj.FN_InitiativesCreateLog();

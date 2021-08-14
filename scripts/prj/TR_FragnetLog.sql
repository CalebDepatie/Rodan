CREATE OR REPLACE FUNCTION prj.FN_FragnetUpdateLog()
  RETURNS TRIGGER
AS $$
BEGIN
  /* Niavely check each field. Probably a more dynamic way to do this */
  IF NEW.title <> OLD.title THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES (NEW.title, NEW.id, uuid_generate_v4(), 'board_fragnet', 'title', NOW()::DATE);
  END IF;

  IF NEW.parent <> OLD.parent THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES (NEW.parent, NEW.id, uuid_generate_v4(), 'board_fragnet', 'parent', NOW()::DATE);
  END IF;

  IF NEW.effort <> OLD.effort THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES (NEW.effort, NEW.id, uuid_generate_v4(), 'board_fragnet', 'effort', NOW()::DATE);
  END IF;

  IF NEW.moscow <> OLD.moscow THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES (NEW.moscow, NEW.id, uuid_generate_v4(), 'board_fragnet', 'moscow', NOW()::DATE);
  END IF;

  IF NEW.tcd <> OLD.tcd THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES (NEW.tcd, NEW.id, uuid_generate_v4(), 'board_fragnet', 'tcd', NOW()::DATE);
  END IF;

  IF NEW.status <> OLD.status THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES (NEW.status, NEW.id, uuid_generate_v4(), 'board_fragnet', 'status', NOW()::DATE);
  END IF;

  RETURN NEW;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER TR_FragnetUpdateLog
  AFTER UPDATE
  ON prj.board_fragnet
  FOR EACH ROW
  EXECUTE PROCEDURE prj.FN_FragnetUpdateLog();

CREATE OR REPLACE FUNCTION prj.FN_FragnetCreateLog()
  RETURNS TRIGGER
AS $$
BEGIN
  INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES
    (NEW.title, NEW.id, uuid_generate_v4(), 'board_fragnet', 'title', NOW()::DATE),
    (NEW.moscow, NEW.id, uuid_generate_v4(), 'board_fragnet', 'moscow', NOW()::DATE),
    (NEW.status, NEW.id, uuid_generate_v4(), 'board_fragnet', 'status', NOW()::DATE);

  IF NEW.parent IS NOT NULL THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
      VALUES (NEW.parent, NEW.id, uuid_generate_v4(), 'board_fragnet', 'parent', NOW()::DATE);
  END IF;

  IF NEW.effort IS NOT NULL THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
      VALUES (NEW.effort, NEW.id, uuid_generate_v4(), 'board_fragnet', 'effort', NOW()::DATE);
  END IF;

  IF NEW.tcd IS NOT NULL THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
      VALUES (NEW.tcd, NEW.id, uuid_generate_v4(), 'board_fragnet', 'tcd', NOW()::DATE);
  END IF;

  RETURN NEW;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER TR_FragnetCreateLog
  AFTER INSERT
  ON prj.board_fragnet
  FOR EACH ROW
  EXECUTE PROCEDURE prj.FN_FragnetCreateLog();

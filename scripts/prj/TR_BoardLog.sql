CREATE OR REPLACE FUNCTION prj.FN_BoardUpdateLog()
  RETURNS TRIGGER
AS $$
BEGIN
  /* Only need to care about state */
  IF NEW.state <> OLD.state THEN
    INSERT INTO prj.change_log (new_value, parent_id, id, table_name, column_name, change_date)
    VALUES (NEW.state, NEW.id, uuid_generate_v4(), 'board_head', 'state', NOW()::DATE);
  END IF;

  RETURN NEW;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER TR_BoardUpdateLog
  AFTER UPDATE
  ON prj.board_head
  FOR EACH ROW
  EXECUTE PROCEDURE prj.FN_BoardUpdateLog();

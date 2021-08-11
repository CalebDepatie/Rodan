CREATE OR REPLACE FUNCTION prj.FN_BoardCRUD (
    _operation INT,

    _title      VARCHAR(255) = NULL,
    _initiative INT          = NULL,
    _draft      BOOL         = FALSE,
    _template   BOOL         = FALSE,

    _board     VARCHAR(36)  = NULL,
    _updateVal VARCHAR(256) = NULL,
    _updateCol VARCHAR(256) = NULL

) RETURNS TABLE (id VARCHAR(36), title VARCHAR(255), initiative INT, draft BOOL, template BOOL, created_date DOUBLE PRECISION)
AS $$
BEGIN
  /*
    1 - Board Creation
    2 - Get Board Heads
    3 - Update Board metadata
    4 - Delete Board by head
  */
  IF _operation = 1 THEN
    INSERT INTO prj.board_head (id, title, initiative, draft, template, created_date)
      VALUES (uuid_generate_v4(), _title, _initiative, _draft, _template, NOW()::DATE);

  ELSIF _operation = 2 THEN
    RETURN QUERY
    SELECT BH.id, BH.title, BH.initiative, BH.draft, BH.template, EXTRACT(EPOCH FROM BH.created_date)
      FROM prj.board_head AS BH;

  ELSIF _operation = 3 THEN
    EXECUTE FORMAT('UPDATE prj.board_head SET %I = $1::%s WHERE prj.board_head.id = $2', _updateCol, (SELECT data_type FROM information_schema.columns WHERE table_name = 'board_head' AND column_name = _updateCol))
      USING _updateVal, _board;

  ELSIF _operation = 4 THEN
    DELETE FROM prj.board_head WHERE prj.board_head.id = _board;

  END IF;
END; $$
LANGUAGE plpgsql;

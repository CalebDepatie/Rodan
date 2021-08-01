CREATE OR REPLACE FUNCTION prj.FN_BoardCRUD (
    _operation INT,

    _initiative INT  = NULL,
    _draft      BOOL = FALSE,
    _template   BOOL = FALSE,

    _board  UUID          = NULL,
    _title  VARCHAR(255)  = NULL,
    _status INT           = NULL,
    _effort INT           = NULL,
    _parent UUID          = NULL,
    _moscow prj.TY_Moscow = NULL,
    _tcd    DATE          = NULL,

    _fragnet   UUID         = NULL,
    _updateVal VARCHAR(256) = NULL,
    _updateCol VARCHAR(256) = NULL

) RETURNS SETOF RECORD
AS $$
BEGIN
  /*
    1 - Board Creation
    2 - Fragnet Creation
    3 - Get Board Heads
    4 - Get specific board, no metadata
    5 - Update Board metadata
    6 - Update Fragnet
    7 - Delete Board by head
    8 - Delete Fragnet
  */
  IF _operation = 1 THEN
    INSERT INTO prj.board_head (id, title, initiative, draft, template, created_date)
      VALUES (uuid_generate_v4(), _title, _initiative, _draft, _template, NOW()::DATE);

  ELSIF _operation = 2 THEN
    INSERT INTO prj.board_fragnet (id, board_id, title, status, effort, parent, moscow, tcd)
      VALUES (uuid_generate_v4(), _board, _title, _status, _effort, _parent, _moscow, _tcd);

  ELSIF _operation = 3 THEN
    RETURN QUERY
    SELECT BH.id, BH.initiative, BH.draft, BH.template,  EXTRACT(EPOCH FROM BH.created_date)
      FROM prj.board_head AS BH;

  ELSIF _operation = 4 THEN
    RETURN QUERY
    SELECT BF.id, BF.board_id, BF.title, BF.status, BF.effort, BF.moscow,  EXTRACT(EPOCH FROM BF.tcd), BF.parent
      FROM prj.board_fragnet AS BF
      WHERE BF.board_id = _board;

  ELSIF _operation = 5 THEN
    EXECUTE FORMAT('UPDATE prj.board_head SET %I = $1::%s WHERE prj.board_head.id = $2', _updateCol, (SELECT data_type FROM information_schema.columns WHERE table_name = 'board_head' AND column_name = _updateCol))
      USING _updateVal, _board;

  ELSIF _operation = 6 THEN
    EXECUTE FORMAT('UPDATE prj.board_fragnet SET %I = $1::%s WHERE prj.board_fragnet.id = $2', _updateCol, (SELECT data_type FROM information_schema.columns WHERE table_name = 'board_fragnet' AND column_name = _updateCol))
      USING _updateVal, _fragnet;

  ELSIF _operation = 7 THEN
    DELETE FROM prj.board_head WHERE prj.board_head.id = _board;

  ELSIF _operation = 8 THEN
    DELETE FROM prj.board_fragnet WHERE prj.board_fragnet.id = _fragnet;

  END IF;
END; $$
LANGUAGE plpgsql;

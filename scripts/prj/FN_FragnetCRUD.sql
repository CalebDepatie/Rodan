CREATE OR REPLACE FUNCTION prj.FN_FragnetCRUD (
    _operation INT,

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

) RETURNS TABLE (id UUID, board_id UUID, title VARCHAR(255), status INT, effort INT, moscow prj.TY_Moscow, tcd DOUBLE PRECISION, parent UUID)
AS $$
BEGIN
  /*
    1 - Fragnet Creation
    2 - Get specific board, no metadata
    3 - Update Fragnet
    4 - Delete Fragnet
  */
  IF _operation = 1 THEN
    INSERT INTO prj.board_fragnet (id, board_id, title, status, effort, parent, moscow, tcd)
      VALUES (uuid_generate_v4(), _board, _title, _status, _effort, _parent, _moscow, _tcd);

  ELSIF _operation = 2 THEN
    RETURN QUERY
    SELECT BF.id, BF.board_id, BF.title, BF.status, BF.effort, BF.moscow, EXTRACT(EPOCH FROM BF.tcd), BF.parent
      FROM prj.board_fragnet AS BF
      WHERE BF.board_id = _board;

  ELSIF _operation = 3 THEN
    EXECUTE FORMAT('UPDATE prj.board_fragnet SET %I = $1::%s WHERE prj.board_fragnet.id = $2', _updateCol, (SELECT data_type FROM information_schema.columns WHERE table_name = 'board_fragnet' AND column_name = _updateCol))
      USING _updateVal, _fragnet;

  ELSIF _operation = 4 THEN
    DELETE FROM prj.board_fragnet WHERE prj.board_fragnet.id = _fragnet;

  END IF;
END; $$
LANGUAGE plpgsql;
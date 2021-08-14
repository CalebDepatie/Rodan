CREATE OR REPLACE FUNCTION prj.FN_FragnetCRUD (
    _operation INT,

    _board  VARCHAR(36)   = NULL,
    _title  VARCHAR(255)  = NULL,
    _status INT           = NULL,
    _effort INT           = NULL,
    _parent VARCHAR(36)   = NULL,
    _moscow VARCHAR(11)   = NULL,
    _tcd    VARCHAR(10)   = NULL,

    _fragnet   VARCHAR(36)  = NULL,
    _updateVal VARCHAR(256) = NULL,
    _updateCol VARCHAR(256) = NULL

) RETURNS TABLE (id VARCHAR(36), board_id VARCHAR(36), title VARCHAR(255), status INT, effort INT, moscow prj.TY_Moscow, tcd DOUBLE PRECISION, parent VARCHAR(36), created_date DOUBLE PRECISION)
AS $$
BEGIN
  /*
    1 - Fragnet Creation
    2 - Get specific board, no metadata
    3 - Update Fragnet
    4 - Delete Fragnet
  */
  IF _operation = 1 THEN
    INSERT INTO prj.board_fragnet (id, board_id, title, status, effort, parent, moscow, tcd, created_date)
      VALUES (uuid_generate_v4(), _board, _title, _status, NULLIF(_effort, 0), NULLIF(_parent, '')::UUID, NULLIF(_moscow, '')::prj.TY_Moscow, NULLIF(_tcd, '')::DATE, NOW()::DATE);

  ELSIF _operation = 2 THEN
    RETURN QUERY
    SELECT BF.id, BF.board_id, BF.title, BF.status, COALESCE(BF.effort, -1), COALESCE(BF.moscow, 'None'::prj.TY_Moscow), COALESCE(EXTRACT(EPOCH FROM BF.tcd), 0), COALESCE(BF.parent, ''), EXTRACT(EPOCH FROM BF.created_date)
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

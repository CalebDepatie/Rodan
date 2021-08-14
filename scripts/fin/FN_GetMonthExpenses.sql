CREATE OR REPLACE FUNCTION fin.FN_GetMonthExpenses (
    _month INT,
    _year  INT
) RETURNS TABLE (category_id integer, company_id integer, name varchar(128), price double precision, date double precision, type integer)
AS $$
BEGIN
    RETURN QUERY
    SELECT o.category_id, o.company_id, o.name, o.price, EXTRACT(EPOCH FROM o.date) AS date, (1) AS type
      FROM fin.once as o
      WHERE EXTRACT(MONTH FROM o.date) = _month AND EXTRACT(YEAR FROM o.date) = _year

    UNION

    SELECT r.category_id, r.company_id, r.name, r.price, EXTRACT(EPOCH FROM r.start_time) AS date, (0) AS type
      FROM fin.reccurring as r
      WHERE EXTRACT(MONTH FROM r.start_time) <= _month AND EXTRACT(YEAR FROM r.start_time) <= _year
        AND EXTRACT(MONTH FROM r.end_time) >= _month AND EXTRACT(YEAR FROM r.end_time) >= _year

    UNION

    SELECT -1, i.company_id, i.name, i.amount, EXTRACT(EPOCH FROM i.date) AS date, (2) AS type
      FROM fin.income as i
      WHERE EXTRACT(MONTH FROM i.date) = _month AND EXTRACT(YEAR FROM i.date) = _year;

END; $$
LANGUAGE plpgsql;

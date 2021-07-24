CREATE OR REPLACE VIEW prj.VV_Projects AS
  SELECT PRJ.id, PRJ.name, PRJ.description, EXTRACT(EPOCH FROM PRJ.created_date) AS created_date, PRJ.status, 0 AS parent
    FROM prj.projects AS PRJ
  UNION
  SELECT INI.id, INI.name, INI.description, EXTRACT(EPOCH FROM INI.created_date) AS created_date, INI.status, INI.parent
    FROM prj.initiatives AS INI
  ORDER BY id ASC;

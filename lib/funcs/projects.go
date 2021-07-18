package funcs

import (
	"github.com/guark/guark/app"
  "github.com/CalebDepatie/ProjectSingularPoint/lib/globals"
  "encoding/json"
  "errors"
  "strings"
)

func GetStatuses(c app.Context) (interface{}, error) {
  comps := []globals.Status{}

  stmt := `SELECT * FROM prj.status;`
  err  := globals.ScrDB.Select(&comps, stmt)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
  }

  bytes, err := json.Marshal(comps)

  if err != nil {
    c.App.Log.Error("Error: ", err.Error())
  }

  return string(bytes), nil
}

func GetProjects(c app.Context) (interface{}, error) {
  comps := []globals.Project{}

  stmt := `SELECT * FROM prj.FN_ProjectCRUD(_operation := 2);`
  err  := globals.ScrDB.Select(&comps, stmt)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
  }

  bytes, err := json.Marshal(comps)

  if err != nil {
    c.App.Log.Error("Error: ", err.Error())
  }

  return string(bytes), nil
}

func CreateProject(c app.Context) (interface{}, error) {
  var (
    stmt string
    err  error
    p globals.Project
    unmarshalErr *json.UnmarshalTypeError
  )

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err = dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
  }

  if p.Parent == 0 {
    stmt   = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 1, _name := $1, _description := $2, _status := $3);`
    _, err = globals.ScrDB.Exec(stmt, p.Name, p.Descrip, p.Status)
  } else {
    stmt   = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 1, _name := $1, _description := $2, _status := $3, _parent := $4);`
    _, err = globals.ScrDB.Exec(stmt, p.Name, p.Descrip, p.Status, p.Parent)
  }

  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
  }

  return nil, nil
}

func DeleteProject(c app.Context) (interface{}, error) {
  comps := []globals.Project{}

  projID := c.GetOr("projID", "").(string)
  iniID  := c.GetOr("iniID", "").(string)

  var (
    stmt string
    err  error
  )

  if projID != "" {
    stmt = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 4, _projectID := $1);`
    err  = globals.ScrDB.Select(&comps, stmt, projID)
  } else {
    stmt = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 4, _initiativeID := $1);`
    err  = globals.ScrDB.Select(&comps, stmt, iniID)
  }

  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
  }

  return nil, nil
}

func UpdateProject(c app.Context) (interface{}, error) {
  comps := []globals.Project{}

  projID    := c.GetOr("projID", "").(string)
  iniID     := c.GetOr("iniID", "").(string)
  updateVal := c.Get("updateVal").(string)
  updateCol := c.Get("updateCol").(string)

  var (
    stmt string
    err  error
  )

  if projID != "" {
    stmt = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 4, _projectID := $1, _updateVal := $2, _updateCol := $3);`
    err  = globals.ScrDB.Select(&comps, stmt, projID, updateVal, updateCol)
  } else {
    stmt = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 4, _initiativeID := $1, _updateVal := $2, _updateCol := $3);`
    err  = globals.ScrDB.Select(&comps, stmt, iniID, updateVal, updateCol)
  }

  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
  }

  return nil, nil
}

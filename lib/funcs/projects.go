package funcs

import (
	"github.com/guark/guark/app"
  "github.com/CalebDepatie/ProjectSingularPoint/lib/globals"
  "encoding/json"
  _ "errors"
  _ "strings"
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
  name      := c.Get("name").(string)
  descrip   := c.Get("descrip").(string)
  status    := c.Get("status").(string)
  parent    := c.GetOr("parent", "").(string)

  var (
    stmt string
    err  error
  )

  if parent == "" {
    stmt   = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 1, _name := $1, _description := $2, _status := $3);`
    _, err = globals.ScrDB.Exec(stmt, name, descrip, status)
  } else {
    stmt   = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 1, _name := $1, _description := $2, _status := $3, _parent := $4);`
    _, err = globals.ScrDB.Exec(stmt, name, descrip, status, parent)
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

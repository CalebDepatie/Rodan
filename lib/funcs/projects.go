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
  var (
    stmt string
    err  error
    unmarshalErr *json.UnmarshalTypeError
  )

  p := struct {
    projID int `json:"projID"`
    iniID  int `json:"iniID"`
  }{
    projID: 0,
    iniID:  0,
  }

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err = dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
  }

  if p.projID != 0 {
    stmt = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 4, _projectID := $1);`
    _, err = globals.ScrDB.Exec(stmt, p.projID)
  } else {
    stmt = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 4, _initiativeID := $1);`
    _, err = globals.ScrDB.Exec(stmt, p.iniID)
  }

  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
  }

  return nil, nil
}

func UpdateProject(c app.Context) (interface{}, error) {
  var (
    stmt string
    err  error
    unmarshalErr *json.UnmarshalTypeError
  )

  p := struct {
    projID    int    `json:"projID"`
    iniID     int    `json:"iniID"`
    updateVal string `json:"updateVal"`
    updateCol string `json:"updateCol"`
  }{
    projID:    0,
    iniID:     0,
    updateVal: "",
    updateCol: "",
  }

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err = dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
  }

  if p.projID != 0 {
    stmt = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 4, _projectID := $1, _updateVal := $2, _updateCol := $3);`
    _, err = globals.ScrDB.Exec(stmt, p.projID, p.updateVal, p.updateCol)
  } else {
    stmt = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 4, _initiativeID := $1, _updateVal := $2, _updateCol := $3);`
    _, err = globals.ScrDB.Exec(stmt, p.iniID, p.updateVal, p.updateCol)
  }

  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
  }

  return nil, nil
}

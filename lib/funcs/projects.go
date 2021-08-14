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

  section := c.GetOr("section", "").(string)

  stmt := `SELECT id, name
            FROM prj.status
            WHERE section = $1
            ORDER BY workflow;`
  err  := globals.DB.Select(&comps, stmt, section)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
    return "", err
  }

  bytes, err := json.Marshal(comps)

  if err != nil {
    c.App.Log.Error("Error: ", err.Error())
    return "", err
  }

  return string(bytes), nil
}

func GetProjects(c app.Context) (interface{}, error) {
  comps := []globals.Project{}

  stmt := `SELECT * FROM prj.FN_ProjectCRUD(_operation := 2);`
  err  := globals.DB.Select(&comps, stmt)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
    return "", err
  }

  bytes, err := json.Marshal(comps)

  if err != nil {
    c.App.Log.Error("Error: ", err.Error())
    return "", err
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
      return "", err
  }

  if p.Parent == 0 {
    stmt   = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 1, _name := $1, _description := $2, _status := $3);`
    _, err = globals.DB.Exec(stmt, p.Name, p.Descrip, p.Status)
  } else {
    stmt   = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 1, _name := $1, _description := $2, _status := $3, _parent := $4);`
    _, err = globals.DB.Exec(stmt, p.Name, p.Descrip, p.Status, p.Parent)
  }

  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
    return "", err
  }

  return "", nil
}

func DeleteProject(c app.Context) (interface{}, error) {
  var (
    stmt string
    err  error
    unmarshalErr *json.UnmarshalTypeError
  )

  p := struct {
    ProjID int `json:"projID"`
    IniID  int `json:"iniID"`
  }{
    ProjID: 0,
    IniID:  0,
  }

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err = dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
      return "", err
  }

  if p.ProjID != 0 {
    stmt = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 4, _projectID := $1);`
    _, err = globals.DB.Exec(stmt, p.ProjID)
  } else {
    stmt = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 4, _initiativeID := $1);`
    _, err = globals.DB.Exec(stmt, p.IniID)
  }

  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
    return "", err
  }

  return "", nil
}

func UpdateProject(c app.Context) (interface{}, error) {
  var (
    stmt string
    err  error
    unmarshalErr *json.UnmarshalTypeError
  )

  p := struct {
    ProjID    int    `json:"projID"`
    IniID     int    `json:"iniID"`
    UpdateVal string `json:"updateVal"`
    UpdateCol string `json:"updateCol"`
  }{
    ProjID:    0,
    IniID:     0,
    UpdateVal: "",
    UpdateCol: "",
  }

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err = dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
      return "", err
  }

  if p.ProjID != 0 {
    stmt = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 3, _projectID := $1, _updateVal := $2, _updateCol := $3);`
    _, err = globals.DB.Exec(stmt, p.ProjID, p.UpdateVal, p.UpdateCol)
  } else {
    stmt = `SELECT * FROM prj.FN_ProjectCRUD(_operation := 3, _initiativeID := $1, _updateVal := $2, _updateCol := $3);`
    _, err = globals.DB.Exec(stmt, p.IniID, p.UpdateVal, p.UpdateCol)
  }

  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
    return "", err
  }

  return "", nil
}

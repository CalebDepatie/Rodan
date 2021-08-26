package funcs

import (
	"github.com/guark/guark/app"
  "github.com/CalebDepatie/ProjectSingularPoint/lib/globals"
  "encoding/json"
  "errors"
  "strings"
)

func GetTasks(c app.Context) (interface{}, error) {
  comps := []struct {
    Id       string `db:"id" json:"id"`
    Title    string `db:"title" json:"title"`
    Descrip  string `db:"description" json:"descrip"`
    Activity string `db:"activity" json:"activity"`
    Status   int    `db:"status" json:"status"`
    Created  string `db:"created_date" json:"created"`
  }{}

  stmt := `SELECT * FROM prj.FN_TaskCRUD(_operation := 2);`
  err  := globals.DB.Select(&comps, stmt)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
    return "{}", err
  }

  bytes, err := json.Marshal(comps)

  if err != nil {
    c.App.Log.Error("Error: ", err.Error())
    return "{}", err
  }

  return string(bytes), nil
}

func CreateTask(c app.Context) (interface{}, error) {
  var (
    stmt string
    err  error
    unmarshalErr *json.UnmarshalTypeError
  )

  p := struct{
    Title    string `db:"title" json:"title"`
    Descrip  string `db:"description" json:"description"`
    Activity string `db:"activity" json:"activity"`
  }{}

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err = dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
      return "{}", err
  }

  stmt   = `SELECT * FROM prj.FN_TaskCRUD(_operation := 1, _title := $1, _description := $2, _activity := $3);`
  _, err = globals.DB.Exec(stmt, p.Title, p.Descrip, p.Activity)

  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
    return "{}", err
  }

  return "{}", nil
}

func UpdateTask(c app.Context) (interface{}, error) {
  var (
    stmt string
    err  error
    unmarshalErr *json.UnmarshalTypeError
  )

  p := struct {
    TaskID    string `json:"taskID"`
    UpdateVal string `json:"updateVal"`
    UpdateCol string `json:"updateCol"`
  }{}

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err = dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
      return "{}", err
  }

  stmt = `SELECT * FROM prj.FN_TaskCRUD(_operation := 3, _TaskID := $1, _updateVal := $2, _updateCol := $3);`
  _, err = globals.DB.Exec(stmt, p.TaskID, p.UpdateVal, p.UpdateCol)

  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
    return "{}", err
  }

  return "{}", nil
}

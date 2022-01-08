package funcs

import (
	"github.com/guark/guark/app"
  "github.com/CalebDepatie/ProjectSingularPoint/lib/globals"
  "encoding/json"
  "errors"
  "strings"
)

func GetPages(c app.Context) (interface{}, error) {
  pages := []struct {
    Id string `db:"id" json:"id"`
    Name string `db:"name" json:"name"`
    Icon string `db:"icon" json:"icon"`
    Content string `db:"content" json:"content"`
    Parent string `db:"parent" json:"parent"`
  }{}

  stmt := `SELECT * FROM prj.FN_PageCRUD(_operation := 2);`
  err  := globals.DB.Select(&pages, stmt)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
    return "{}", err
  }

  bytes, err := json.Marshal(pages)

  if err != nil {
    c.App.Log.Error("Error: ", err.Error())
    return "{}", err
  }

  return string(bytes), nil
}

func CreatePage(c app.Context) (interface{}, error) {
  var (
    unmarshalErr *json.UnmarshalTypeError
  )

  page_args := struct {
    Name string `db:"name" json:"name"`
    Icon string `db:"initiative" json:"initiative"`
    Parent string `db:"parent" json:"parent"`
  }{}

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err := dec.Decode(&page_args)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
      return "{}", err
  }

  stmt := `SELECT * FROM prj.FN_PageCRUD(_operation := 1, _name:=$1, _icon:=$2, _parent:=$3);`
  _, err = globals.DB.Exec(stmt, page_args.Name, page_args.Icon, page_args.Parent)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
    return "{}", err
  }

  return "{}", nil
}

func UpdatePage(c app.Context) (interface{}, error) {
  var (
    stmt string
    err  error
    unmarshalErr *json.UnmarshalTypeError
  )

  p := struct {
    Id   string `json:"id"`
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

  stmt = `SELECT * FROM prj.FN_PageCRUD(_operation := 3, _id := $1, _updateVal := $2, _updateCol := $3);`
  _, err = globals.DB.Exec(stmt, p.Id, p.UpdateVal, p.UpdateCol)

  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
    return "{}", err
  }

  return "{}", nil
}

func DeletePage(c app.Context) (interface{}, error) {
  var (
    stmt string
    err  error
    unmarshalErr *json.UnmarshalTypeError
  )

  p := struct {
    Id string `json:"id"`
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

  stmt = `SELECT * FROM prj.FN_PageCRUD(_operation := 4, _id := $1);`
  _, err = globals.DB.Exec(stmt, p.Id)

  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
    return "{}", err
  }

  return "{}", nil
}

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

  stmt := `SELECT * FROM prj.projects;`
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

func GetInitiatives(c app.Context) (interface{}, error) {
  comps := []globals.Initiative{}

  stmt := `SELECT * FROM prj.initiatives;`
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

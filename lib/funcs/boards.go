package funcs

import (
	"github.com/guark/guark/app"
  "github.com/CalebDepatie/ProjectSingularPoint/lib/globals"
  "encoding/json"
  "errors"
  "strings"
)

func GetBoardHeads(c app.Context) (interface{}, error) {
  board_heads := []struct {
    Id       string `db:"id" json:"id"`
    Ini      int    `db:"initiative" json:"initiative"`
    Title    string `db:"title" json:"title"`
    Draft    bool   `db:"draft" json:"draft"`
    Template bool   `db:"template" json:"template"`
    Created  string `db:"created_date" json:"created"`
  }{}

  stmt := `SELECT * FROM prj.FN_BoardCRUD(_operation := 2);`
  err  := globals.ScrDB.Select(&board_heads, stmt)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
  }

  bytes, err := json.Marshal(board_heads)

  if err != nil {
    c.App.Log.Error("Error: ", err.Error())
  }

  return string(bytes), nil
}

func GetBoard(c app.Context) (interface{}, error) {
  board_frags := []struct {
    Id       string `db:"id" json:"id"`
    BoardId  string `db:"board_id" json:"board_id"`
    Title    string `db:"title" json:"title"`
    Status   int    `db:"status" json:"status"`
    Effort   int    `db:"effort" json:"effort"`
    Parent   string `db:"parent" json:"parent"`
    Moscow   string `db:"moscow" json:"moscow"`
    TCD      string `db:"tcd" json:"tcd"`
  }{}

  board := c.GetOr("board", "").(string)

  stmt := `SELECT * FROM prj.FN_BoardCRUD(_operation := 3, _board := $1);`
  err  := globals.ScrDB.Select(&board_frags, stmt, board)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
  }

  bytes, err := json.Marshal(board_frags)

  if err != nil {
    c.App.Log.Error("Error: ", err.Error())
  }

  return string(bytes), nil
}

func CreateBoard(c app.Context) (interface{}, error) {
  var (
    unmarshalErr *json.UnmarshalTypeError
  )

  board_args := struct {
    Ini      int    `db:"initiative" json:"initiative"`
    Title    string `db:"title" json:"title"`
    Draft    bool   `db:"draft" json:"draft"`
    Template bool   `db:"template" json:"template"`
  }{}

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err := dec.Decode(&board_args)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
  }

  stmt := `SELECT * FROM prj.FN_BoardCRUD(_operation := 1, _initiative := $1, _title := $2, _draft := $3, _template := $4);`
  _, err = globals.ScrDB.Exec(stmt, board_args.Ini, board_args.Title, board_args.Draft, board_args.Template)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
  }

  if err != nil {
    c.App.Log.Error("Error: ", err.Error())
  }

  return nil, nil
}

func CreateFragnet(c app.Context) (interface{}, error) {
  var (
    unmarshalErr *json.UnmarshalTypeError
  )

  board_args := struct {
    BoardId  string `db:"board_id" json:"board_id"`
    Title    string `db:"title" json:"title"`
    Status   int    `db:"status" json:"status"`
    Effort   int    `db:"effort" json:"effort"`
    Parent   string `db:"parent" json:"parent"`
    Moscow   string `db:"moscow" json:"moscow"`
    TCD      string `db:"tcd" json:"tcd"`
  }{}

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err := dec.Decode(&board_args)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
  }

  stmt := `SELECT * FROM prj.FN_BoardCRUD(_operation := 2, _board := $1, _title := $2, _status := $3, _effort := $4, _parent := $5, _moscow := $6, _tcd := $7);`
  _, err = globals.ScrDB.Exec(stmt, board_args.BoardId, board_args.Title, board_args.Status, board_args.Effort, board_args.Parent, board_args.Moscow, board_args.TCD)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
  }

  if err != nil {
    c.App.Log.Error("Error: ", err.Error())
  }

  return nil, nil
}
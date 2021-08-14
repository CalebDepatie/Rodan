package funcs

import (
	"github.com/guark/guark/app"
  "github.com/CalebDepatie/ProjectSingularPoint/lib/globals"
  "encoding/json"
  "errors"
  "strings"
)

func NewRecur(c app.Context) (interface{}, error) {

  var (
    p globals.Recur
    unmarshalErr *json.UnmarshalTypeError
  )

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err := dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
      return "", err
  }

  stmt   := `INSERT INTO fin.reccurring (category_id, company_id, name, price, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6);`
  _, err = globals.DB.Exec(stmt, p.Cat, p.Com, p.Name, p.Price, p.Start_date, p.End_date)
  if err != nil {
    c.App.Log.Info("New Recur Pay Error: ", err.Error())
    return "", err
  }

	return "", nil
}

func NewOne(c app.Context) (interface{}, error) {

  var (
    p globals.Once
    unmarshalErr *json.UnmarshalTypeError
  )

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err := dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
      return "", err
  }

  stmt   := `INSERT INTO fin.once (category_id, company_id, name, price, date) VALUES ($1, $2, $3, $4, $5);`
	_, err = globals.DB.Exec(stmt, p.Cat, p.Com, p.Name, p.Price, p.Date)
  if err != nil {
    c.App.Log.Info("New One Pay Error: ", err.Error())
    return "", err
  }

	return "", nil
}

func GetCom(c app.Context) (interface{}, error) {
  comps := []globals.Companies{}

  stmt := `SELECT * FROM fin.companies;`
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

func GetCat(c app.Context) (interface{}, error) {
  comps := []globals.Companies{}

  stmt := `SELECT * FROM fin.categories;`
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

func NewCat(c app.Context) (interface{}, error) {

  var (
    p globals.Categories
    unmarshalErr *json.UnmarshalTypeError
  )

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err := dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
      return "", err
  }

  stmt   := `INSERT INTO fin.categories (name, descrip) VALUES ($1, $2);`
	_, err = globals.DB.Exec(stmt, p.Name, p.Descrip)
  if err != nil {
    c.App.Log.Error("New Category Error: ", err.Error())
    return "", err
  }

	return "", nil
}

func NewCom(c app.Context) (interface{}, error) {

  var (
    p globals.Companies
    unmarshalErr *json.UnmarshalTypeError
  )

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err := dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
      return "", err
  }

  stmt   := `INSERT INTO fin.companies (name, descrip) VALUES ($1, $2);`
	_, err = globals.DB.Exec(stmt, p.Name, p.Descrip)
  if err != nil {
    c.App.Log.Error("New Company Error: ", err.Error())
    return "", err
  }

	return "", nil
}

func NewIncome(c app.Context) (interface{}, error) {

  var (
    p globals.Income
    unmarshalErr *json.UnmarshalTypeError
  )

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err := dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
      return "", err
  }

  stmt   := `INSERT INTO fin.income (company_id, name, amount, date) VALUES ($1, $2, $3, $4);`
	_, err = globals.DB.Exec(stmt, p.Com, p.Name, p.Amount, p.Date)
  if err != nil {
    c.App.Log.Error("New Income Error: ", err.Error())
    return "", err
  }

	return "", nil
}

func GetMonthFinances(c app.Context) (interface{}, error) {
  var (
    r []globals.FinanceRecord
    unmarshalErr *json.UnmarshalTypeError
    err error
  )

  time := struct {
    M int `json:"month"`
    Y int `json:"year"`
  }{
    M: 6,    // safe defaults
    Y: 2021,
  }

  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err = dec.Decode(&time)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
      return "", err
  }

  stmt := `SELECT * FROM fin.FN_GetMonthExpenses($1, $2);`
	err  = globals.DB.Select(&r, stmt, time.M, time.Y)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
    return "", err
  }

  //c.App.Log.Debug("Len: ", len(r))

  bytes, err := json.Marshal(r)

  if err != nil {
    c.App.Log.Error("Error: ", err.Error())
    return "", err
  }

  return string(bytes), nil
}

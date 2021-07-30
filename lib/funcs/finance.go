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
  }

  stmt   := `INSERT INTO public.reccurring (category_id, company_id, name, price, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6);`
  _, err = globals.FinDB.Exec(stmt, p.Cat, p.Com, p.Name, p.Price, p.Start_date, p.End_date)
  if err != nil {
    c.App.Log.Info("New Recur Pay Error: ", err.Error())
  }

	return nil, nil
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
  }

  stmt   := `INSERT INTO public.once (category_id, company_id, name, price, date) VALUES ($1, $2, $3, $4, $5);`
	_, err = globals.FinDB.Exec(stmt, p.Cat, p.Com, p.Name, p.Price, p.Date)
  if err != nil {
    c.App.Log.Info("New One Pay Error: ", err.Error())
  }

	return nil, nil
}

func GetCom(c app.Context) (interface{}, error) {
  comps := []globals.Companies{}

  stmt := `SELECT * FROM public.companies;`
	err  := globals.FinDB.Select(&comps, stmt)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
  }

  bytes, err := json.Marshal(comps)

  if err != nil {
    c.App.Log.Error("Error: ", err.Error())
  }

	return string(bytes), nil
}

func GetCat(c app.Context) (interface{}, error) {
  comps := []globals.Companies{}

  stmt := `SELECT * FROM public.categories;`
	err  := globals.FinDB.Select(&comps, stmt)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
  }

  bytes, err := json.Marshal(comps)

  if err != nil {
    c.App.Log.Error("Error: ", err.Error())
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
  }

  stmt   := `INSERT INTO public.categories (name, descrip) VALUES ($1, $2);`
	_, err = globals.FinDB.Exec(stmt, p.Name, p.Descrip)
  if err != nil {
    c.App.Log.Error("New Category Error: ", err.Error())
  }

	return nil, nil
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
  }

  stmt   := `INSERT INTO public.companies (name, descrip) VALUES ($1, $2);`
	_, err = globals.FinDB.Exec(stmt, p.Name, p.Descrip)
  if err != nil {
    c.App.Log.Error("New Company Error: ", err.Error())
  }

	return nil, nil
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
  }

  stmt   := `INSERT INTO public.income (company_id, name, amount, date) VALUES ($1, $2, $3, $4);`
	_, err = globals.FinDB.Exec(stmt, p.Com, p.Name, p.Amount, p.Date)
  if err != nil {
    c.App.Log.Error("New Income Error: ", err.Error())
  }

	return nil, nil
}

func GetMonthFinances(c app.Context) (interface{}, error) {
  var (
    r []globals.FinanceRecord
    unmarshalErr *json.UnmarshalTypeError
    err error
  )

  time := struct {
    m int `json:"month"`
    y int `json:"year"`
  }{
    m: 6,    // safe defaults
    y: 2021,
  }

  c.App.Log.Debug("STRUCT ", c.GetOr("body", "").(string))
  dec := json.NewDecoder(strings.NewReader(c.GetOr("body", "").(string)))
  err = dec.Decode(&time)

  c.App.Log.Debug("TIME ", time)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        c.App.Log.Error("JSON Error: ", unmarshalErr.Field)
      } else {
        c.App.Log.Error("Request Error: ", err.Error())
      }
  }

  stmt := `SELECT * FROM public.FN_GetMonthExpenses($1, $2);`
	err  = globals.FinDB.Select(&r, stmt, time.m, time.y)
  if err != nil {
    c.App.Log.Error("Error getting data: ", err.Error())
  }

  //c.App.Log.Debug("Len: ", len(r))

  bytes, err := json.Marshal(r)

  if err != nil {
    c.App.Log.Error("Error: ", err.Error())
  }

  return string(bytes), nil
}

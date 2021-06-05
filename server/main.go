package main

import (
	"encoding/json"
  "errors"
	"log"
	"net/http"

	_ "github.com/lib/pq"
	"github.com/jmoiron/sqlx"
)

type (
  Categories struct {
  	Id      int    `db:"id" json:"id"`
  	Name    string `db:"name" json:"name"`
  	Descrip string `db:"descrip" json:"descrip"`
  }

  Companies struct {
  	Id      int    `db:"id" json:"id"`
  	Name    string `db:"name" json:"name"`
  	Descrip string `db:"descrip" json:"descrip"`
  }

  Recur struct {
  	Cat        int     `db:"category_id" json:"cat"`
  	Com        int     `db:"company_id" json:"com"`
  	Name       string  `db:"name" json:"name"`
  	Price      float64 `db:"price" json:"price"`
  	Start_date string  `db:"start_time" json:"start_date"`
  	End_date   string  `db:"end_time" json:"end_date"`
  }

  Once struct {
  	Cat   int     `db:"category_id" json:"cat"`
  	Com   int     `db:"company_id" json:"com"`
  	Name  string  `db:"name" json:"name"`
  	Price float64 `db:"price" json:"price"`
  	Date  string  `db:"date" json:"date"`
  }

  Income struct {
    Com    int     `db:"company_id" json:"com"`
    Name   string  `db:"name" json:"name"`
    Amount float64 `db:"amount" json:"amount"`
    Date   string  `db:"date" json:"date"`
  }

  // specifically used to aggregate recur and once for the front end
  Expense struct {
    Cat   int         `db:"category_id" json:"cat"`
  	Com   int         `db:"company_id" json:"com"`
  	Name  string      `db:"name" json:"name"`
  	Price float64     `db:"price" json:"price"`
  	Date  string      `db:"date" json:"date"`
    Type  FinanceType `db"type" json:"type"`
  }

  Response struct {
    Ok    bool
    error string
  }
)

type FinanceType int
const (
  recur FinanceType = iota
  once
)

const (
	CON_STRING = "postgres://howling:wolf@localhost:50000/finance?sslmode=disable"
)

var db *sqlx.DB

func main() {
	db, _ = sqlx.Open("postgres", CON_STRING)

	err := db.Ping()
	if err != nil {
		log.Fatal("Could not connect to server: ", err)
	}
	defer db.Close()

  // finance based handlers
	http.HandleFunc("/newrecur",  handleNewRecur)
  http.HandleFunc("/newone",    handleNewOne)
  http.HandleFunc("/newcat",    handleNewCat)
  http.HandleFunc("/newcom",    handleNewCom)
  http.HandleFunc("/newincome", handleNewIncome)

  http.HandleFunc("/getcat", handleGetCat)
  http.HandleFunc("/getcom", handleGetCom)

  http.HandleFunc("/getmonthexpenses", handleGetMonthExpenses)

  log.Println("Ready to serve")
	log.Fatal(http.ListenAndServe(":8081", nil))

}

// retreives the expenses from a view
func handleGetMonthExpenses(w http.ResponseWriter, r *http.Request) {
  query := r.URL.Query()

  month, ok := query["month"]
  if !ok || len(month) == 0 {
    log.Println("Expense Query incorrect")
  }

  year, ok := query["year"]
  if !ok || len(year) == 0 {
    log.Println("Expense Query incorrect")
  }

  var e []Expense

  stmt := `SELECT * FROM public.get_month_expenses($1, $2);`
	err  := db.Select(&e, stmt, month[0], year[0])
  if err != nil {
    log.Println("Error getting data: ", err.Error())
  }

  w.Header().Set("Content-Type", "application/json")
  w.Header().Set("Access-Control-Allow-Origin", "*")

  json.NewEncoder(w).Encode(e)

}

// these are all basically the same, I could roll this up into one function for most of the work

func handleNewIncome(w http.ResponseWriter, r *http.Request) {
  if r.Header.Get("Content-Type") != "application/json" {
    return
  }

  var (
    p Income
    unmarshalErr *json.UnmarshalTypeError
  )

  dec := json.NewDecoder(r.Body)
  err := dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        log.Println("JSON Error: ", unmarshalErr.Field)
        ret := Response{true, "JSON Error: " + unmarshalErr.Field}
        json.NewEncoder(w).Encode(ret)
      } else {
        log.Println("Request Error: ", err.Error())
        ret := Response{true, "Request Error: " + err.Error()}
        json.NewEncoder(w).Encode(ret)
      }
  }

  w.Header().Set("Content-Type", "application/json")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  //w.WriteHeader(http.StatusOk)
  ret := Response{true, ""}
  json.NewEncoder(w).Encode(ret)

  stmt   := `INSERT INTO public.income (company_id, name, amount, date) VALUES ($1, $2, $3, $4);`
	_, err = db.Exec(stmt, p.Com, p.Name, p.Amount, p.Date)
  if err != nil {
    log.Println("New Income Error: ", err.Error())
  }
}

func handleNewCat(w http.ResponseWriter, r *http.Request) {
  if r.Header.Get("Content-Type") != "application/json" {
    return
  }

  var (
    p Categories
    unmarshalErr *json.UnmarshalTypeError
  )

  dec := json.NewDecoder(r.Body)
  err := dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        log.Println("JSON Error: ", unmarshalErr.Field)
        ret := Response{true, "JSON Error: " + unmarshalErr.Field}
        json.NewEncoder(w).Encode(ret)
      } else {
        log.Println("Request Error: ", err.Error())
        ret := Response{true, "Request Error: " + err.Error()}
        json.NewEncoder(w).Encode(ret)
      }
  }

  w.Header().Set("Content-Type", "application/json")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  //w.WriteHeader(http.StatusOk)
  ret := Response{true, ""}
  json.NewEncoder(w).Encode(ret)

  stmt   := `INSERT INTO public.categories (name, descrip) VALUES ($1, $2);`
	_, err = db.Exec(stmt, p.Name, p.Descrip)
  if err != nil {
    log.Println("New Category Error: ", err.Error())
  }
}

func handleNewCom(w http.ResponseWriter, r *http.Request) {
  if r.Header.Get("Content-Type") != "application/json" {
    return
  }

  var (
    p Companies
    unmarshalErr *json.UnmarshalTypeError
  )

  dec := json.NewDecoder(r.Body)
  err := dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        log.Println("JSON Error: ", unmarshalErr.Field)
        ret := Response{true, "JSON Error: " + unmarshalErr.Field}
        json.NewEncoder(w).Encode(ret)
      } else {
        log.Println("Request Error: ", err.Error())
        ret := Response{true, "Request Error: " + err.Error()}
        json.NewEncoder(w).Encode(ret)
      }
  }

  w.Header().Set("Content-Type", "application/json")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  //w.WriteHeader(http.StatusOk)
  ret := Response{true, ""}
  json.NewEncoder(w).Encode(ret)

  stmt   := `INSERT INTO public.companies (name, descrip) VALUES ($1, $2);`
	_, err = db.Exec(stmt, p.Name, p.Descrip)
  if err != nil {
    log.Println("New Company Error: ", err.Error())
  }
}

func handleGetCat(w http.ResponseWriter, r *http.Request) {
  c := []Categories{}

  stmt := `SELECT * FROM public.categories;`
	err  := db.Select(&c, stmt)
  if err != nil {
    log.Println("Error getting data: ", err.Error())
  }

  w.Header().Set("Content-Type", "application/json")
  w.Header().Set("Access-Control-Allow-Origin", "*")

  json.NewEncoder(w).Encode(c)
}

func handleGetCom(w http.ResponseWriter, r *http.Request) {
  c := []Companies{}

  stmt := `SELECT * FROM public.companies;`
	err  := db.Select(&c, stmt)
  if err != nil {
    log.Println("Error getting data: ", err.Error())
  }

  w.Header().Set("Content-Type", "application/json")
  w.Header().Set("Access-Control-Allow-Origin", "*")

  json.NewEncoder(w).Encode(c)
}

func handleNewOne(w http.ResponseWriter, r *http.Request) {
  if r.Header.Get("Content-Type") != "application/json" {
    return
  }

  var (
    p Once
    unmarshalErr *json.UnmarshalTypeError
  )

  dec := json.NewDecoder(r.Body)
  //dec.DisallowUnknownFields()
  err := dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        log.Println("JSON Error: ", unmarshalErr.Field)
        ret := Response{true, "JSON Error: " + unmarshalErr.Field}
        json.NewEncoder(w).Encode(ret)
      } else {
        log.Println("Request Error: ", err.Error())
        ret := Response{true, "Request Error: " + err.Error()}
        json.NewEncoder(w).Encode(ret)
      }
  }

  w.Header().Set("Content-Type", "application/json")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  //w.WriteHeader(http.StatusOk)
  ret := Response{true, ""}
  json.NewEncoder(w).Encode(ret)

  stmt   := `INSERT INTO public.once (category_id, company_id, name, price, date) VALUES ($1, $2, $3, $4, $5);`
	_, err = db.Exec(stmt, p.Cat, p.Com, p.Name, p.Price, p.Date)
  if err != nil {
    log.Println("New One Pay Error: ", err.Error())
  }
}

func handleNewRecur(w http.ResponseWriter, r *http.Request) {
  if r.Header.Get("Content-Type") != "application/json" {
    return
  }

  var (
    p Recur
    unmarshalErr *json.UnmarshalTypeError
  )

  dec := json.NewDecoder(r.Body)
  //dec.DisallowUnknownFields()
  err := dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        log.Println("JSON Error: ", unmarshalErr.Field)
        ret := Response{true, "JSON Error: " + unmarshalErr.Field}
        json.NewEncoder(w).Encode(ret)
      } else {
        log.Println("Request Error: ", err.Error())
        ret := Response{true, "Request Error: " + err.Error()}
        json.NewEncoder(w).Encode(ret)
      }
  }

  w.Header().Set("Content-Type", "application/json")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  //w.WriteHeader(http.StatusOk)
  ret := Response{true, ""}
  json.NewEncoder(w).Encode(ret)

  stmt   := `INSERT INTO public.reccurring (category_id, company_id, name, price, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6);`
	_, err = db.Exec(stmt, p.Cat, p.Com, p.Name, p.Price, p.Start_date, p.End_date)
  if err != nil {
    log.Println("New Recur Pay Error: ", err.Error())
  }
}

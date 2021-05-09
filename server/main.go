package main

import (
	"encoding/json"
  "errors"
	"log"
	"net/http"
	"time"

	_ "github.com/lib/pq"
	"github.com/jmoiron/sqlx"
)

type (
  categories struct {
  	id      int
  	name    string
  	descrip string
  }

  companies struct {
  	id      int
  	name    string
  	descrip string
  }

  recur struct {
  	cat        int `db:category_id json:"cat"`
  	com        int `db:company_id json:"com"`
  	name       string `json:"name"`
  	price      float32 `json:"price"`
  	start_date time.Time `db:start_time json:"start_date"`
  	end_date   time.Time `db:end_time json:"end_date"`
  }

  once struct {
  	cat   int `db:category_id`
  	com   int `db:company_id`
  	name  string
  	price float32
  	date  time.Time
  }

  response struct {
    ok bool
  }
)

const (
	CON_STRING = "postgres://howling:wolf@localhost:50000/finance?sslmode=disable"
)

var db sqlx.DB

func main() {
	db, err := sqlx.Open("postgres", CON_STRING)
	if err != nil {
		log.Fatal("Could not connect to server: ", err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatal("Could not connect to server: ", err)
	}
	defer db.Close()

	http.HandleFunc("/newrecur", handleNewRecur)

  log.Println("Ready to serve")
	log.Fatal(http.ListenAndServe(":8081", nil))

}

func handleNewRecur(w http.ResponseWriter, r *http.Request) {
  if r.Header.Get("Content-Type") != "application/json" {
    return
  }

  var (
    p recur
    unmarshalErr *json.UnmarshalTypeError
  )

  dec := json.NewDecoder(r.Body)
  //dec.DisallowUnknownFields()
  err := dec.Decode(&p)

  if err != nil {
      if errors.As(err, &unmarshalErr) {
        log.Println("JSON Error: ", unmarshalErr.Field)
      } else {
        log.Println("Request Error: ", err.Error())
      }
  }

  log.Println(p.name)

  w.Header().Set("Content-Type", "application/json")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  //w.WriteHeader(http.StatusOk)
  ret := response{true}
  json.NewEncoder(w).Encode(ret)

  newRecurPayment(p)
}

func newOnePayment(data once) {
	stmt := `INSERT INTO public.once (category_id, company_id, name, price, date) VALUES (?, ?, ?, ?, ?)`
	db.MustExec(stmt, data.cat, data.com, data.name, data.price, data.date)
}

func newRecurPayment(data recur) {
	stmt := `INSERT INTO public.reccurring (category_id, company_id, name, price, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)`
	db.MustExec(stmt, data.cat, data.com, data.name, data.price, data.start_date, data.end_date)
}

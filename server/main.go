package main

import (
	"encoding/json"
	"time"
	"log"
	"net/http"
	
	"github.com/jmoiron/sqlx"
	_ "github.com/jackc/pgx/v4"
)

const (
	CON_STRING = "postgres://howling:wolf@localhost:50000/finance"
)

type recur struct {
	cat int `db:category_id`
	com int `db:company_id`
	name string
	price float32
	start_date time.Time `db:start_time`
	end_date time.Time `db:end_time`
}

type once struct {
	cat int `db:category_id`
	com int `db:company_id`
	name string
	price float32
	date time.Time
}

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
	
	log.Fatal(http.ListenAndServe(":8080", nil))
	

}

func newOnePayment(db sqlx.DB, data once) {
	stmt := `INSERT INTO public.once (category_id, company_id, name, price, date) VALUES (?, ?, ?, ?, ?)`
	db.MustExec(stmt, data.cat, data.com, data.name, data.price, data.date)
}

func newRecurPayment(db sqlx.DB, data recur) {
	stmt := `INSERT INTO public.reccurring (category_id, company_id, name, price, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)`
	db.MustExec(stmt, data.cat, data.com, data.name, data.price, data.start_date, data.end_date)
}
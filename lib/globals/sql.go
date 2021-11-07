package globals

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"os"
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
	FinanceRecord struct {
		Cat   int         `db:"category_id" json:"cat"`
		Com   int         `db:"company_id" json:"com"`
		Name  string      `db:"name" json:"name"`
		Price float64     `db:"price" json:"price"`
		Date  string      `db:"date" json:"date"`
		Type  FinanceType `db"type" json:"type"`
	}

	Status struct {
		Id      int    `db:"id" json:"id"`
		Name    string `db:"name" json:"name"`
		Descrip string `db:"description" json:"descrip"`
	}

	Project struct {
		Id      int    `db:"id" json:"id"`
		Name    string `db:"name" json:"name"`
		Descrip string `db:"description" json:"descrip"`
		Created string `db:"created_date" json:"created"`
		Status  int    `db:"status" json:"status"`
		Parent  int    `db:"parent" json:"parent"`
	}
)

type FinanceType int

const (
	recur FinanceType = iota
	once
	income
)

var DB *sqlx.DB

func init() {
	DB, _ = sqlx.Open("postgres", os.Getenv("CON_STRING"))

	err := DB.Ping()
	if err != nil {
		//a.Log.Error("Could not connect to server: ", err)
	}
}

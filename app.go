package main

import (
	"github.com/CalebDepatie/ProjectSingularPoint/lib"
	"github.com/CalebDepatie/ProjectSingularPoint/lib/globals"
	"github.com/guark/guark/app"
	"github.com/guark/guark/engine"
	"github.com/guark/guark/log"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"os"
)

func main() {

	err := godotenv.Load()

	a := &app.App{
		Log:     log.New("app"),
		Hooks:   lib.Hooks,
		Funcs:   lib.Funcs,
		Embed:   lib.Embeds,
		Plugins: lib.Plugins,
	}

	if err != nil {
		a.Log.Fatal("Error loading .env file")
	}

	if err = a.Use(engine.New(a)); err != nil {
		a.Log.Fatal(err)
	}

	globals.DB, _ = sqlx.Open("postgres", os.Getenv("CON_STRING"))

	err = globals.DB.Ping()
	if err != nil {
		a.Log.Error("Could not connect to server: ", err)
	}

	defer a.Quit()

	defer globals.DB.Close()

	if err := a.Run(); err != nil {
		a.Log.Fatal(err)
	}
}

package main

import (
	"github.com/CalebDepatie/ProjectSingularPoint/lib"
	"github.com/CalebDepatie/ProjectSingularPoint/lib/globals"
	"github.com/guark/guark/app"
	"github.com/guark/guark/engine"
	"github.com/guark/guark/log"
	"github.com/joho/godotenv"
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

	defer a.Quit()

	defer globals.DB.Close()

	if err := a.Run(); err != nil {
		a.Log.Fatal(err)
	}
}

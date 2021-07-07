package main

import (
	"github.com/guark/guark/app"
	"github.com/guark/guark/log"
	"github.com/guark/guark/engine"
	"github.com/CalebDepatie/ProjectSingularPoint/lib"
  "github.com/CalebDepatie/ProjectSingularPoint/lib/globals"
)

func main() {

	a := &app.App{
		Log:     log.New("app"),
		Hooks:   lib.Hooks,
		Funcs:   lib.Funcs,
		Embed:   lib.Embeds,
		Plugins: lib.Plugins,
	}

	if err := a.Use(engine.New(a)); err != nil {
		a.Log.Fatal(err)
	}

	defer a.Quit()

  defer globals.FinDB.Close()
  defer globals.ScrDB.Close()

	if err := a.Run(); err != nil {
		a.Log.Fatal(err)
	}
}

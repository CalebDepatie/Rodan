package lib

import (
	"github.com/guark/guark/app"
	"github.com/guark/plugins/clipboard"
	"github.com/guark/plugins/dialog"
	"github.com/guark/plugins/notify"
	"github.com/CalebDepatie/ProjectSingularPoint/lib/funcs"
	"github.com/CalebDepatie/ProjectSingularPoint/lib/hooks"
)

// Exposed functions to guark Javascript api.
var Funcs = app.Funcs{
	"new_recur": funcs.NewRecur,
  "new_one": funcs.NewOne,
  "get_com": funcs.GetCom,
  "get_cat": funcs.GetCat,
  "new_com": funcs.NewCom,
  "new_cat": funcs.NewCat,
  "new_inc": funcs.NewIncome,
}

// App hooks.
var Hooks = app.Hooks{
	"created": hooks.Created,
	"mounted": hooks.Mounted,
}

// App plugins.
var Plugins = app.Plugins{
	"dialog":    &dialog.Plugin{},
	"notify":    &notify.Plugin{},
	"clipboard": &clipboard.Plugin{},
}

// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package main

import (
	"bytes"
	"crypto/md5"
	"fmt"
	"html/template"
	"io"
	"log"
	"os"
	"path"

	worktemplate "github.com/julientant/mattermost-worktemplate/gogenerator"
	"golang.org/x/tools/imports"
	"gopkg.in/yaml.v3"
)

type WorkTemplateWithMD5 struct {
	worktemplate.WorkTemplate
	MD5 string
}

func main() {
	dat, err := os.ReadFile(path.Join("templates.yaml"))
	if err != nil {
		log.Fatal(err)
	}

	dec := yaml.NewDecoder(bytes.NewReader(dat))

	h := md5.New()
	ts := []WorkTemplateWithMD5{}
	for {
		t := worktemplate.WorkTemplate{}
		err = dec.Decode(&t)
		if err != nil {
			if err == io.EOF {
				break
			}
			log.Fatal(err)
		}
		if t.ID == "" {
			continue
		}

		h.Write([]byte(t.ID))
		ts = append(ts, WorkTemplateWithMD5{
			WorkTemplate: t,
			MD5:          fmt.Sprintf("%x", h.Sum(nil)),
		})
		h.Reset()
	}

	code := bytes.NewBuffer(nil)
	tmpl, err := template.New("test").Parse(tpl)
	if err != nil {
		log.Fatal(err)
	}
	tmpl.Execute(code, ts)

	formattedCode, err := imports.Process(path.Join("worktemplate_generated.go"), code.Bytes(), &imports.Options{Comments: true})
	if err != nil {
		log.Fatal(err)
	}

	err = os.WriteFile(path.Join("worktemplate_generated.go"), formattedCode, 0644)
	if err != nil {
		log.Fatal(err)
	}
}

var tpl = `// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// Code generated by "make store-layers"
// DO NOT EDIT

package worktemplate

func init() {
	var err error
	{{range .}}if err = registerWorkTemplate("{{.ID}}", wt{{.MD5}}); err != nil {
		panic(err)
	}
	{{end}}

	// Register translation strings
	{{range . -}}
		{{if and (.Description.Channel) (ne .Description.Channel.ID "")}}_ = T("{{.Description.Channel.ID}}")
		{{end -}}
		{{if and (.Description.Board) (ne .Description.Board.ID "")}}_ = T("{{.Description.Board.ID}}")
		{{end -}}
		{{if and (.Description.Playbook) (ne .Description.Playbook.ID "")}}_ = T("{{.Description.Playbook.ID}}")
		{{end -}}
		{{if and (.Description.Integration) (ne .Description.Integration.ID "")}}_ = T("{{.Description.Integration.ID}}")
		{{end -}}
	{{end -}}
}

{{range .}}
var wt{{.MD5}} = &WorkTemplate{
	ID:           "{{.ID}}",
	Category:     "{{.Category}}",
	UseCase:      "{{.UseCase}}",
	Illustration: "{{.Illustration}}",
	Visibility:   "{{.Visibility}}",
	{{if .FeatureFlag}}FeatureFlag: &FeatureFlag{
		Name:  "{{.FeatureFlag.Name}}",
		Value: "{{.FeatureFlag.Value}}",
	},{{end}}
	Description: Description{
		{{if .Description.Channel}}Channel: &TranslatableString{
			ID:             "{{.Description.Channel.ID}}",
			DefaultMessage: "{{.Description.Channel.DefaultMessage}}",
			Illustration:   "{{.Description.Channel.Illustration}}",
		},{{end}}
		{{if .Description.Board}}Board: &TranslatableString{
			ID:             "{{.Description.Board.ID}}",
			DefaultMessage: "{{.Description.Board.DefaultMessage}}",
			Illustration:   "{{.Description.Board.Illustration}}",
		},{{end}}
		{{if .Description.Playbook}}Playbook: &TranslatableString{
			ID:			    "{{.Description.Playbook.ID}}",
			DefaultMessage: "{{.Description.Playbook.DefaultMessage}}",
			Illustration:   "{{.Description.Playbook.Illustration}}",
		},{{end}}
		{{if .Description.Integration}}Integration: &TranslatableString{
			ID:             "{{.Description.Integration.ID}}",
			DefaultMessage: "{{.Description.Integration.DefaultMessage}}",
			Illustration:   "{{.Description.Integration.Illustration}}",
		},{{end}}
	},
	Content: []Content{
		{{range .Content}}{
			{{if .Channel}}Channel: &Channel{
				ID:           "{{.Channel.ID}}",
				Name:         "{{.Channel.Name}}",
				Purpose:      "{{.Channel.Purpose}}",
				Playbook:     "{{.Channel.Playbook}}",
				Illustration: "{{.Channel.Illustration}}",
			},{{end}}{{if .Board}}Board: &Board{
				ID:           "{{.Board.ID}}",
				Template:     "{{.Board.Template}}",
				Name:         "{{.Board.Name}}",
				Channel:      "{{.Board.Channel}}",
				Illustration: "{{.Board.Illustration}}",
			},{{end}}{{if .Playbook}}Playbook: &Playbook{
				Template:     "{{.Playbook.Template}}",
				Name:         "{{.Playbook.Name}}",
				ID:           "{{.Playbook.ID}}",
				Illustration: "{{.Playbook.Illustration}}",
			},{{end}}{{if .Integration}}Integration: &Integration{
				ID: "{{.Integration.ID}}",
			},{{end}}
		},
		{{end}}
	},
}
{{end}}
`

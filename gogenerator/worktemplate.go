//go:generate go run generator/main.go

// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package worktemplate

import "fmt"

var OrderedWorkTemplates = []*WorkTemplate{}
var WorkTemplatesByID = map[string]*WorkTemplate{}

func T(id string) string {
	return id
}

// registerWorkTemplate adds the given WorkTemplate to the WorkTemplates map.
// it returns an error if the key is already taken
func registerWorkTemplate(id string, wt *WorkTemplate) error {
	if _, ok := WorkTemplatesByID[id]; ok {
		return fmt.Errorf("WorkTemplate with ID %s already exists", id)
	}
	WorkTemplatesByID[id] = wt
	OrderedWorkTemplates = append(OrderedWorkTemplates, wt)
	return nil
}

type WorkTemplateStore struct{}

func (WorkTemplateStore) ListCategories() ([]string, error) {
	categories := []string{}
	foundCategories := map[string]struct{}{}
	for i := range OrderedWorkTemplates {
		if _, ok := foundCategories[OrderedWorkTemplates[i].Category]; !ok {
			categories = append(categories, OrderedWorkTemplates[i].Category)
			foundCategories[OrderedWorkTemplates[i].Category] = struct{}{}
		}
	}

	return categories, nil
}

func (WorkTemplateStore) ListByCategory(category string) ([]*WorkTemplate, error) {
	wts := []*WorkTemplate{}
	for i := range OrderedWorkTemplates {
		if OrderedWorkTemplates[i].Category == category {
			wts = append(wts, OrderedWorkTemplates[i])
		}
	}

	return wts, nil
}

func (WorkTemplateStore) Get(id string) (*WorkTemplate, error) {
	wt, ok := WorkTemplatesByID[id]
	if !ok {
		return nil, fmt.Errorf("WorkTemplate with ID %s does not exist", id)
	}

	return wt, nil
}

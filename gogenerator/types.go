// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package worktemplate

type WorkTemplate struct {
	ID           string       `yaml:"id"`
	Category     string       `yaml:"category"`
	UseCase      string       `yaml:"useCase"`
	Illustration string       `yaml:"illustration"`
	Visibility   string       `yaml:"visibility"`
	FeatureFlag  *FeatureFlag `yaml:"featureFlag,omitempty"`
	Description  Description  `yaml:"description"`
	Content      []Content    `yaml:"content"`
}

type FeatureFlag struct {
	Name  string `yaml:"name"`
	Value string `yaml:"value"`
}

type TranslatableString struct {
	ID             string `yaml:"id"`
	DefaultMessage string `yaml:"defaultMessage"`
	Illustration   string `yaml:"illustration"`
}

type Description struct {
	Channel     *TranslatableString `yaml:"channel"`
	Board       *TranslatableString `yaml:"board"`
	Playbook    *TranslatableString `yaml:"playbook"`
	Integration *TranslatableString `yaml:"integration"`
}

type Channel struct {
	ID           string `yaml:"id"`
	Name         string `yaml:"name"`
	Purpose      string `yaml:"purpose"`
	Playbook     string `yaml:"playbook"`
	Illustration string `yaml:"illustration"`
}

type Board struct {
	ID           string `yaml:"id"`
	Template     string `yaml:"template"`
	Name         string `yaml:"name"`
	Channel      string `yaml:"channel"`
	Illustration string `yaml:"illustration"`
}

type Playbook struct {
	Template     string `yaml:"template"`
	Name         string `yaml:"name"`
	ID           string `yaml:"id"`
	Illustration string `yaml:"illustration"`
}

type Integration struct {
	ID string `yaml:"id"`
}

type Content struct {
	Channel     *Channel     `yaml:"channel,omitempty"`
	Board       *Board       `yaml:"board,omitempty"`
	Playbook    *Playbook    `yaml:"playbook,omitempty"`
	Integration *Integration `yaml:"integration,omitempty"`
}

// from MM

// TranslateFunc is the type of the translate functions
type TranslateFunc func(translationID string, args ...any) string

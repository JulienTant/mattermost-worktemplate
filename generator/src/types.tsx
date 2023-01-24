export interface Playbook {
  template: string;
  name: string;
  illustration: string;
  id: string;
}


export interface Channel {
  name: string;
  illustration: string;
  id: string;
  purpose?: string;
  playbook?: string;
}

export interface Board {
  template: string;
  name: string;
  illustration: string;
  channel?: string
  id: string
}

export interface Integration {
  id: string;
}

export interface Description {
  channel: TranslatableString;
  board: TranslatableString;
  playbook: TranslatableString;
  integration: TranslatableStringWithIllustration;
}

export interface TranslatableString {
  id: string;
  defaultMessage: string;
}

export interface TranslatableStringWithIllustration extends TranslatableString {
  illustration: string;
}

export interface FeatureFlag {
  name: string;
  value: string;
}

export type Visibility = 'public' | 'private';
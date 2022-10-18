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

export type Visibility = 'public' | 'private';
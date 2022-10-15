export interface Playbook {
  key: string;
  template: string;
  name: string;
  illustration: string;
  id: string;
}

export interface Channel {
  key: string;
  name: string;
  illustration: string;
  id?: string;
  purpose?: string;
  playbook?: string;
}

export interface Board {
  key: string;
  template: string;
  name: string;
  illustration: string;
  channel?: string
}
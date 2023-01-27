import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { slugify } from '../App';
import { Playbook } from '../types';

interface PlaybookFormProps {
  playbook: Playbook;
  onPlaybookSaved: (playbook: Playbook) => void;
}

const Templates = [
  { key: 'Product Release', name: 'Product Release' },
  { key: 'Incident Resolution', name: 'Incident Resolution' },
  { key: 'Customer Onboarding', name: 'Customer Onboarding' },
  { key: 'Employee Onboarding', name: 'Employee Onboarding' },
  { key: 'Feature Lifecycle', name: 'Feature Lifecycle' },
  { key: 'Bug Bash', name: 'Bug Bash' },
];

export function PlaybookForm(props: PlaybookFormProps) {
  const playbook = props.playbook;
  const updatePlaybook = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newPlaybook = {
      ...playbook,
      [e.target.name]: e.target.value,
    };

    // get template
    const template = Templates.find(
      (template) => template.key === newPlaybook.template
    );

    newPlaybook.illustration = `/static/worktemplates/playbooks/${slugify(template?.name.trim().toLowerCase() || '')}.svg`;

    props.onPlaybookSaved(newPlaybook);
  };

  return (
    <div className="row">
      <div className="col-12">
        <FormGroup>
          <Label>Template</Label>
          <Input
            type="select"
            name="template"
            value={playbook.template}
            onChange={updatePlaybook}
          >
            <option value={''}></option>
            {Templates.map((template) => (
              <option key={template.key} value={template.key}>
                {template.name}
              </option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={playbook.name}
            onChange={updatePlaybook}
          />
        </FormGroup>

        <FormGroup>
          <Label>Illustration (509x352)</Label>
          <Input
            type="text"
            name="illustration"
            value={playbook.illustration}
            onChange={updatePlaybook}
          />
        </FormGroup>
      </div>
    </div>
  );
}

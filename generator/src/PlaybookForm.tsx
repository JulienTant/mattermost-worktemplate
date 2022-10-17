import React  from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { Playbook } from './types';
import { slufigy } from './utils';

interface PlaybookFormProps {
    playbook: Playbook;
    onPlaybookSaved: (playbook: Playbook) => void;
}

const Templates = [
    { key: 'product-release', name: 'Product Release', illustration: '/test-1.png' },
    { key: 'incident-resolution', name: 'Incident Resolution', illustration: '' },
    { key: 'customer-onboarding', name: 'Customer Onboarding', illustration: '' },
    { key: 'employee-onboarding', name: 'Employee Onboarding', illustration: '' },
    { key: 'feature-lifecycle', name: 'Feature Lifecycle', illustration: '' },
    { key: 'bug-bash', name: 'Bug Bash', illustration: '' },
]

export function PlaybookForm(props: PlaybookFormProps) {
    const playbook = props.playbook;
    const updatePlaybook = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newPlaybook = {
            ...playbook,
            [e.target.name]: e.target.value
        };

        if (e.target.name === 'name') {
            newPlaybook.id = `playbook-${slufigy(e.target.value)}`;
        }

        if (e.target.name === 'template' && newPlaybook.illustration === '') {
            newPlaybook.illustration = Templates.find(t => t.key === newPlaybook.template)?.illustration || '';
        }

        props.onPlaybookSaved(newPlaybook);
    };

    return (
        <div className='row'>
            <div className='col-12'>
                <FormGroup>
                    <Label>Template</Label>
                    <Input type='select' name='template' value={playbook.template} onChange={updatePlaybook}>
                        <option value={''}></option>
                        {Templates.map((template) => (
                            <option key={template.key} value={template.key}>{template.name}</option>
                        ))}
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label >Name</Label>
                    <Input type='text' name='name' value={playbook.name} onChange={updatePlaybook} />
                </FormGroup>

                <FormGroup>
                    <Label >Illustration</Label>
                    <Input type='text' name='illustration' value={playbook.illustration} onChange={updatePlaybook} />
                </FormGroup>
            </div>
        </div>
    );
}

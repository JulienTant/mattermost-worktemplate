import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { Playbook } from '../types';

interface PlaybookFormProps {
    playbook: Playbook;
    onPlaybookSaved: (playbook: Playbook) => void;
}

const Templates = [
    { key: 'Product Release', name: 'Product Release', illustration: '/static/worktemplates/playbook/product-release.png' },
    { key: 'Incident Resolution', name: 'Incident Resolution', illustration: '/static/worktemplates/playbook/incident-resolution.png' },
    { key: 'Customer Onboarding', name: 'Customer Onboarding', illustration: '/static/worktemplates/playbook/customer-onboarding.png' },
    { key: 'Employee Onboarding', name: 'Employee Onboarding', illustration: '/static/worktemplates/playbook/employee-onboarding.png' },
    { key: 'Feature Lifecycle', name: 'Feature Lifecycle', illustration: '/static/worktemplates/playbook/feature-lifecycle.png' },
    { key: 'Bug Bash', name: 'Bug Bash', illustration: '/static/worktemplates/playbook/bug-bash.png' },
]

export function PlaybookForm(props: PlaybookFormProps) {
    const [changedIllustration, setChangedIllustration] = React.useState(false);

    const playbook = props.playbook;
    const updatePlaybook = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newPlaybook = {
            ...playbook,
            [e.target.name]: e.target.value
        };

        switch (e.target.name) {
            case 'illustration':
                setChangedIllustration(true);
                break;
            case 'template':
                if (!changedIllustration) {
                    newPlaybook.illustration = Templates.find(t => t.key === newPlaybook.template)?.illustration || '';
                }
                break;
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
                    <Label >Illustration (509x352)</Label>
                    <Input type='text' name='illustration' value={playbook.illustration} onChange={updatePlaybook} />
                </FormGroup>
            </div>
        </div>
    );
}

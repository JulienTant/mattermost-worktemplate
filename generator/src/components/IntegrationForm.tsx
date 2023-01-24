import React, { ChangeEvent } from 'react';
import { FormGroup, Input, Label } from "reactstrap";
import { Integration } from '../types';



export default function IntegrationForm({integrations, setIntegrations} : {integrations: Integration[], setIntegrations: (integrations: Integration[]) => void}) {
    const formIntegrations = integrations.map(i => i.id);

    const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setIntegrations(value.map(id => ({id})));
    }

    return (
        <FormGroup>
            <Label for="integrations">
                Integrations
            </Label>
            <Input
                id="integrations"
                name="integrations"
                type="select"
                multiple
                value={formIntegrations}
                // @ts-ignore
                onChange={handleOnChange}
            >
                <option value='github'>
                    GitHub
                </option>
                <option value='jira'>
                    Jira
                </option>
            </Input>
        </FormGroup>
    )
}
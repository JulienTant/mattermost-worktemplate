import React from 'react';
import { Input } from 'reactstrap';
import yaml from 'js-yaml';
import { Board, Channel, Description, FeatureFlag, Integration, Playbook } from '../types';

interface Props {
    workTemplateId: string;
    category: string;
    useCase: string;
    illustration: string;
    visibility: string;

    description: Description;

    hasFeatureFlag: boolean;
    featureFlag: FeatureFlag;

    playbooks: Playbook[];
    channels: Channel[];
    boards: Board[];
    integrations: Integration[];
}

export default function YamlOutput(props: Props) {
    const { illustration, hasFeatureFlag, featureFlag, workTemplateId, category, useCase, visibility, playbooks, channels, boards, integrations, description} = props;

    let workTemplateOut = {
        id: workTemplateId,
        category,
        useCase,
        illustration,
        visibility,
        description,
        content: [] as any[],
    } as {
        id: string;
        category: string;
        illustration: string;
        useCase: string;
        visibility: string;
        featureFlag?: FeatureFlag;
        description: Description;
        content: any[];
    };

    if (hasFeatureFlag) {
        workTemplateOut.featureFlag = featureFlag
    }


    // add playbooks
    for (const pb of playbooks) {
        workTemplateOut.content.push({
            playbook: {
                ...pb,
            }
        });
    }
    // add channels
    for (const chan of channels) {
        workTemplateOut.content.push({
            channel: {
                ...chan,
            }
        });
    }
    // add boards
    for (const board of boards) {
        workTemplateOut.content.push({
            board: {
                ...board,
            }
        });
    }
    // add integrations
    for (const integration of integrations) {
        workTemplateOut.content.push({
            integration: {
                ...integration,
            }
        });
    }

    const output = yaml.dump(workTemplateOut);

    return (
        <div>
            <h3>YAML Output</h3>

            <Input readOnly type="textarea" rows={20} value={output} />
        </div>
    )
}
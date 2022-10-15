import React, { useState } from 'react';
import { FormGroup, Input, Label, Badge } from 'reactstrap';
import { Channel } from './types';
import { slufigy } from './utils';

interface ChannelFormInterface {
    channel: Channel;
    isFromPlaybook: boolean;
    onChannelSaved: (channel: Channel) => void;
}

export function ChannelForm(props: ChannelFormInterface) {
    const channel = props.channel;

    const updateChannel = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newChannel = {
            ...channel,
            [e.target.name]: e.target.value
        };

        if (e.target.name === 'name') {
            newChannel.id = `channel-${slufigy(e.target.value)}`;
        }

        props.onChannelSaved(newChannel);
    };

    const disabled = props.isFromPlaybook;

    return (
        <div className='row'>
            <div className='col-12'>
                <FormGroup>
                    <Label >Name</Label>
                    <Input type='text' name='name' value={channel.name} onChange={updateChannel} disabled={disabled} />
                </FormGroup>

                {!props.isFromPlaybook && (
                    <FormGroup>
                        <Label >Purpose</Label>
                        <Input type='text' name='purpose' value={channel.purpose} onChange={updateChannel} disabled={disabled} />
                    </FormGroup>
                )}

                <FormGroup>
                    <Label >Illustration</Label>
                    <Input type='text' name='illustration' value={channel.illustration} onChange={updateChannel} />
                </FormGroup>
            </div>
        </div>
    );
}

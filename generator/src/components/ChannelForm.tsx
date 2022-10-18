import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import { Channel } from '../types';

interface ChannelFormInterface {
    channel: Channel;
    onChannelSaved: (channel: Channel) => void;
}

export function ChannelForm(props: ChannelFormInterface) {
    const channel = props.channel;

    const updateChannel = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newChannel = {
            ...channel,
            [e.target.name]: e.target.value
        };

        props.onChannelSaved(newChannel);
    };

    const isFromPlaybook = !!channel.playbook;

    return (
        <div className='row'>
            <div className='col-12'>
                <FormGroup>
                    <Label >Name</Label>
                    <Input type='text' name='name' value={channel.name} onChange={updateChannel} disabled={isFromPlaybook} />
                </FormGroup>

                {!isFromPlaybook && (
                    <FormGroup>
                        <Label >Purpose</Label>
                        <Input type='text' name='purpose' value={channel.purpose} onChange={updateChannel} />
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

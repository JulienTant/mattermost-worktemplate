import React from 'react';
import { Badge, Button } from 'reactstrap';
import {
  Board,
  Channel,
  FeatureFlag,
  Integration,
  Playbook,
  Visibility,
} from '../types';

interface PreviewProps {
  category: string;
  useCase: string;
  visibility: Visibility;

  hasFeatureFlag: boolean;
  featureFlag: FeatureFlag;

  playbooks: Playbook[];
  channels: Channel[];
  boards: Board[];
  integrations: Integration[];

  onPlaybookRemoved: (key: string) => void;
  onChannelRemoved: (key: string) => void;
  onBoardRemoved: (key: string) => void;
  onIntegrationRemoved: (id: string) => void;
}

export default function Preview(props: PreviewProps) {
  const {
    hasFeatureFlag,
    featureFlag,
    category,
    useCase,
    visibility,
    playbooks,
    channels,
    boards,
    integrations,
  } = props;

  // Can't manually removed the playbook's generated channel
  // Also can't remove a channel that has boards linked to it
  const canRemoveChannel = (chan: Channel) => {
    const boardsUseChannel = boards.some((b) => b.channel === chan.id);
    const channelFromPlaybook = !!chan.playbook;

    return !boardsUseChannel && !channelFromPlaybook;
  };

  // Can't remove a playbook if its channel is used by a board
  const canRemovePlaybook = (pb: Playbook) => {
    const [chan] = channels.filter((c) => c.playbook === pb.id);
    const boardsUseChannel = boards.some((b) => b.channel === chan.id);

    return !boardsUseChannel;
  };

  return (
    <>
      <h3>Preview</h3>
      <strong>Category: </strong> {category} <br />
      <strong>Use Case: </strong> {useCase} <br />
      <strong>Visibility: </strong> {visibility} <br />
      {hasFeatureFlag && (
        <span>
          <strong>Feature Flag: </strong> {featureFlag.name}={featureFlag.value}{' '}
          <br />
        </span>
      )}
      {channels.length > 0 && (
        <>
          <h5>Channels</h5>
          <ul>
            {channels.map((channel) => (
              <li key={channel.id}>
                {channel.name}
                {channel.playbook && (
                  <>
                    &nbsp;
                    <Badge>from {channel.playbook}</Badge>
                  </>
                )}
                {canRemoveChannel(channel) && (
                  <Button
                    color="danger"
                    size="sm"
                    outline
                    onClick={() => props.onChannelRemoved(channel.id)}
                  >
                    x
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {boards.length > 0 && (
        <>
          <h5>Boards</h5>
          <ul>
            {boards.map((board) => (
              <li key={board.id}>
                {board.name}
                {board.channel && (
                  <>
                    &nbsp;
                    <Badge>attached to {board.channel} </Badge>
                  </>
                )}
                <Button
                  color="danger"
                  size="sm"
                  outline
                  onClick={() => props.onBoardRemoved(board.id)}
                >
                  x
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
      {playbooks.length > 0 && (
        <>
          <h5>Playbooks</h5>
          <ul>
            {playbooks.map((playbook) => (
              <li key={playbook.id}>
                {playbook.name}
                {canRemovePlaybook(playbook) && (
                  <Button
                    color="danger"
                    size="sm"
                    outline
                    onClick={() => props.onPlaybookRemoved(playbook.id)}
                  >
                    x
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {integrations.length > 0 && (
        <>
          <h5>Integrations</h5>
          <ul>
            {integrations.map((integration) => (
              <li key={integration.id}>
                {integration.id}

                <Button
                  color="danger"
                  size="sm"
                  outline
                  onClick={() => props.onIntegrationRemoved(integration.id)}
                >
                  x
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

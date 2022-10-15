import React, { useState } from 'react';
import { FormGroup, ButtonGroup, Label, Input, Button, Badge, UncontrolledAccordion, AccordionBody, AccordionHeader } from 'reactstrap';
import { BoardForm } from './BoardForm';
import { ChannelForm } from './ChannelForm';
import { PlaybookForm } from './PlaybookForm';
import { Board, Channel, Playbook } from './types';
import { slufigy } from './utils';

const PlaybookGeneratedChannelKey = 'playbook-generated-channel';

const Categories = [
  { key: 'category-1', value: 'category-1', name: 'Category 1' },
  { key: 'category-2', value: 'category-2', name: 'Category 2' },
  { key: 'category-3', value: 'category-3', name: 'Category 3' },
]

export default function App() {

  const [category, setCategory] = useState('');
  const [useCase, setUseCase] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');

  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);

  const playbookSaved = (newPb: Playbook) => {
    setPlaybooks([newPb]);

    // find the generated channel 
    const [chan] = channels.filter(c => c.key === PlaybookGeneratedChannelKey)
    channelSaved({
      ...chan,
      name: newPb.name,
      id: `channel-${slufigy(newPb.name)}`,
      playbook: newPb.id,
    });
  }

  const channelSaved = (chan: Channel) => {
    setChannels(channels.map(c => c.key === chan.key ? chan : c));
  }

  const boardSaved = (board: Board) => {
    setBoards(boards.map(b => b.key === board.key ? board : b));
  }

  const addPlaybook = () => {
    setPlaybooks([
      ...playbooks,
      {
        key: `playbook-${new Date().getTime()}`,
        id: '',
        template: '',
        name: '',
        illustration: '',
      }
    ]);

    setChannels([
      {
        key: PlaybookGeneratedChannelKey,
        illustration: '',
        name: '',
      },
      ...channels,
    ]);
  };

  const addChannel = () => {
    setChannels([
      ...channels,
      {
        key: `channel-${new Date().getTime()}`,
        illustration: '',
        name: '',
      }
    ]);
  };

  const addBoard = () => {
    setBoards([
      ...boards,
      {
        key: `board-${new Date().getTime()}`,
        template: '',
        name: '',
        illustration: '',
      }
    ]);
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-12'>
          <h1>Work Template Generator</h1>

        </div>
      </div>

      <div className='row' style={{ marginTop: '1em' }}>
        <div className='col-8'>

          <div className='row'>
            <div className='col-12'>
              <FormGroup>
                <Label>Category</Label>
                <Input type='select' name='category' value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value=''>Select a category</option>
                  {Categories.map(c => <option key={c.key} value={c.value}>{c.name}</option>)}
                </Input>
              </FormGroup>

              <FormGroup>
                <Label>Use Case</Label>
                <Input type='text' name='use-case' value={useCase} onChange={(e) => setUseCase(e.target.value)} />
              </FormGroup>

              <FormGroup>
                <Label>Visibility</Label>
                <div>
                  <ButtonGroup>
                    <Button color='success' outline onClick={() => setVisibility('public')} active={visibility === 'public'}>Public</Button>
                    <Button color='danger' outline onClick={() => setVisibility('private')} active={visibility === 'private'}>Private</Button>
                  </ButtonGroup>
                </div>
              </FormGroup>
            </div>
          </div>

          <div className='row'>
            <div className='col-12'>
              <h2>Content</h2>
              <Button 
              color='primary' 
              onClick={addPlaybook} 
              disabled={playbooks.length === 1}
              >
                {playbooks.length === 0 ? 'Add a playbook' : 'Max 1 Playbook'}
              </Button>
              &nbsp;
              <Button color='primary' onClick={addChannel}>+ Add a channel</Button>
              &nbsp;
              <Button color='primary' onClick={addBoard}>+ Add a board</Button>
            </div>
          </div>

          <UncontrolledAccordion
            stayOpen
            open={''}
            style={{marginTop: '1em'}}
          >
            {playbooks.map((playbook) => (
              <>
                <AccordionHeader targetId={playbook.key}>
                  Playbook: {playbook.name}
                </AccordionHeader>
                <AccordionBody accordionId={playbook.key}>
                  <PlaybookForm key={playbook.key} playbook={playbook} onPlaybookSaved={playbookSaved} />
                </AccordionBody>
              </>
            ))}


            {channels.map((channel) => (
              <>
                <AccordionHeader targetId={channel.key}>
                  Channel: {channel.name}&nbsp;{channel.playbook && <Badge color='primary'>{channel.playbook}</Badge>}
                </AccordionHeader>
                <AccordionBody accordionId={channel.key}>
                  <ChannelForm key={channel.key} isFromPlaybook={channel.key === PlaybookGeneratedChannelKey} channel={channel} onChannelSaved={channelSaved} />
                </AccordionBody>
              </>
            ))}

            {boards.map((board) => (
              <>
                <AccordionHeader targetId={board.key}>
                  Board: {board.name}
                </AccordionHeader>
                <AccordionBody accordionId={board.key}>
                  <BoardForm key={board.key} board={board} channels={channels} onBoardSaved={boardSaved} />
                </AccordionBody>
              </>
            ))}

          </UncontrolledAccordion>
        </div>
        <div className='col-4'>
          <div className='row'>
            <div className='col-12'>
              <h3>Preview</h3>

              <strong>Category: </strong> {category} <br />
              <strong>Use Case: </strong> {useCase} <br />
              <strong>Visibility: </strong> {visibility} <br />

              {channels.length > 0 && (
                <>
                  <h5>Channels</h5>
                  <ul>
                    {channels.map((channel) => (
                      <li key={channel.key}>
                        {channel.name}
                        {channel.playbook && (
                          <>
                            &nbsp;
                            <Badge>{channel.playbook}</Badge>
                          </>
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
                      <li key={board.key}>
                        {board.name}
                        {board.channel && (
                          <>
                            &nbsp;
                            <Badge>{board.channel} </Badge>
                          </>
                        )}
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
                      <li key={playbook.key}>{playbook.name}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


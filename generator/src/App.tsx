import React, { useState } from 'react';
import { FormGroup, ButtonGroup, Label, Input, Button, Badge, AccordionBody, AccordionHeader, Accordion } from 'reactstrap';
import { BoardForm } from './components/BoardForm';
import { ChannelForm } from './components/ChannelForm';
import { PlaybookForm } from './components/PlaybookForm';
import Preview from './components/Preview';
import { Board, Channel, Playbook, Visibility } from './types';


const Categories = [
  { key: 'product_team', name: 'Product Team' },
  { key: 'devops', name: 'Dev Ops' },
  { key: 'company_wide', name: 'Company - Wide' },
  { key: 'leadership', name: 'Leadership' },
  { key: 'design', name: 'Design' },
]

export default function App() {
  const [category, setCategory] = useState('');
  const [useCase, setUseCase] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [accordionOpen, setAccordionOpen] = useState<string[]>([]);

  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);

  const getChannelForPlaybookKey = (key: string) => {
    // find playbook
    const [playbook] = playbooks.filter(pb => pb.id === key);
    return channels.find(c => c.playbook === playbook.id)!;
  }

  const playbookSaved = (newPb: Playbook) => {
    setPlaybooks([newPb]);

    // find the generated channel 
    const [chan] = channels.filter(c => c.playbook === newPb.id)
    channelSaved({
      ...chan,
      name: newPb.name,
    });
  }

  const channelSaved = (chan: Channel) => {
    setChannels(channels.map(c => c.id === chan.id ? chan : c));
  }

  const boardSaved = (board: Board) => {
    setBoards(boards.map(b => b.id === board.id ? board : b));
  }

  const addPlaybook = () => {
    const pbKey = `playbook-${new Date().getTime()}` 
    setPlaybooks([
      ...playbooks,
      {
        id: pbKey,
        template: '',
        name: '',
        illustration: '',
      }
    ]);

    const chanKey = `channel-${new Date().getTime()}`
    setChannels([
      {
        id: chanKey,
        illustration: '',
        name: '',
        playbook: pbKey,
      },
      ...channels,
    ]);

      setAccordionOpen([...accordionOpen, pbKey, chanKey]);
  };

  const addChannel = () => {
    const key = `channel-${new Date().getTime()}`
    setChannels([
      ...channels,
      {
        id: key,
        illustration: '',
        name: '',
      }
    ]);

      setAccordionOpen([...accordionOpen, key]);
  };

  const addBoard = () => {
    const key = `board-${new Date().getTime()}`
    setBoards([
      ...boards,
      {
        id: key,
        template: '',
        name: '',
        illustration: '',
      }
    ]);

      setAccordionOpen([...accordionOpen, key]);
  };

  const removePlaybook = (key: string) => {
    setAccordionOpen(accordionOpen.filter(k => k !== key));
    const chan = getChannelForPlaybookKey(key);

    removeChannel(chan.id);
    setPlaybooks(playbooks.filter(pb => pb.id !== key));
  }

  const removeChannel = (key: string) => {
    setAccordionOpen(accordionOpen.filter(k => k !== key));
    setChannels(channels.filter(c => c.id !== key));
  }

  const removeBoard = (key: string) => {
    setAccordionOpen(accordionOpen.filter(k => k !== key));
    setChannels(channels.filter(c => c.id !== key));
    setBoards(boards.filter(b => b.id !== key));
  }

  const toggleAccordion = (key: string) => {
    if (accordionOpen.includes(key)) {
      setAccordionOpen(accordionOpen.filter(k => k !== key));
    } else {
      setAccordionOpen([...accordionOpen, key]);
    }
  }

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
                  {Categories.map(c => <option key={c.key} value={c.key}>{c.name}</option>)}
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
                {playbooks.length === 0 ? '+ Add a playbook' : 'Max 1 Playbook'}
              </Button>
              &nbsp;
              <Button color='primary' onClick={addChannel}>+ Add a channel</Button>
              &nbsp;
              <Button color='primary' onClick={addBoard}>+ Add a board</Button>
            </div>
          </div>

          <Accordion
            open={accordionOpen}
            {...{toggle: toggleAccordion}} // not pretty but reactstrap ts definition is broken https://github.com/reactstrap/reactstrap/issues/2165
            style={{marginTop: '1em'}}
          >
            {channels.map((channel) => (
              <>
                <AccordionHeader targetId={channel.id}>
                  Channel: {channel.name}&nbsp;{channel.playbook && <Badge color='primary'>from {channel.playbook}</Badge>}
                </AccordionHeader>
                <AccordionBody accordionId={channel.id}>
                  <ChannelForm key={channel.id} channel={channel} onChannelSaved={channelSaved} />
                </AccordionBody>
              </>
            ))}

            {boards.map((board) => (
              <>
                <AccordionHeader targetId={board.id}>
                  Board: {board.name}
                </AccordionHeader>
                <AccordionBody accordionId={board.id}>
                  <BoardForm key={board.id} board={board} channels={channels} onBoardSaved={boardSaved} />
                </AccordionBody>
              </>
            ))}

            {playbooks.map((playbook) => (
              <>
                <AccordionHeader targetId={playbook.id}>
                  Playbook: {playbook.name}
                </AccordionHeader>
                <AccordionBody accordionId={playbook.id}>
                  <PlaybookForm key={playbook.id} playbook={playbook} onPlaybookSaved={playbookSaved} />
                </AccordionBody>
              </>
            ))}
          </Accordion>
        </div>
        <div className='col-4'>
          <div className='row'>
            <div className='col-12'>
              <Preview
                category={category}
                useCase={useCase}
                visibility={visibility}

                playbooks={playbooks}
                channels={channels}
                boards={boards}

                onPlaybookRemoved={removePlaybook}
                onChannelRemoved={removeChannel}
                onBoardRemoved={removeBoard}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  FormGroup,
  ButtonGroup,
  Label,
  Input,
  Button,
  Badge,
  AccordionBody,
  AccordionHeader,
  Accordion,
} from 'reactstrap';
import { BoardForm } from './components/BoardForm';
import { ChannelForm } from './components/ChannelForm';
import IntegrationForm from './components/IntegrationForm';
import { PlaybookForm } from './components/PlaybookForm';
import Preview from './components/Preview';
import {
  Board,
  Channel,
  Description,
  FeatureFlag,
  Integration,
  Playbook,
  Visibility,
} from './types';
import YamlOutput from './components/YamlOutput';

function slugify(txt: string) {
  return txt
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/[^\w_]+/g, '');
}

const Categories = [
  { key: 'product_team', name: 'Product Team' },
  { key: 'devops', name: 'Dev Ops' },
  { key: 'company_wide', name: 'Company - Wide' },
  { key: 'leadership', name: 'Leadership' },
  { key: 'design', name: 'Design' },
];

export default function App() {
  const [category, setCategory] = useState('');
  const [useCase, setUseCase] = useState('');
  const [illustration, setIllustration] = useState('');
  const [hasChangedIllustration, setHasChangedIllustration] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [accordionOpen, setAccordionOpen] = useState<string[]>([]);

  const [hasFeatureFlag, setHasFeatureFlag] = useState(false);
  const [featureFlag, setFeatureFlag] = useState<FeatureFlag>({
    name: '',
    value: '',
  });

  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [description, setDescription] = useState<Description>({
    channel: {
      id: 'worktemplate.[category_id].[work_template_name].channel',
      defaultMessage: 'Description of why the channel(s) are needed',
    },
    board: {
      id: 'worktemplate.[category_id].[work_template_name].board',
      defaultMessage: 'Description of why the board(s) are needed',
    },
    playbook: {
      id: 'worktemplate.[category_id].[work_template_name].playbook',
      defaultMessage: 'Description of why the playbook(s) are needed',
    },
    integration: {
      id: 'worktemplate.[category_id].[work_template_name].integration',
      defaultMessage: 'Description of why the integration(s) are needed',
      illustration: '/static/worktemplates/{FIXME}.png',
    },
  });
  const [
    hasChangedIntegrationIllustration,
    setHasChangedIntegrationIllustration,
  ] = useState(false);

  let idSuffix = ':v1';
  if (hasFeatureFlag) {
    idSuffix = `:v${slugify(featureFlag.name)}=${slugify(featureFlag.value)}`;
  }
  const workTemplateId = `${slugify(category)}/${slugify(useCase)}${idSuffix}`;
  const slugCategory = slugify(category);
  const slugUseCase = slugify(useCase);

  useEffect(() => {
    setDescription((oldDesc) => {
      const prefix = `worktemplate.${slugCategory}.${slugUseCase}`;
      return {
        ...oldDesc,
        channel: {
          ...oldDesc.channel,
          id: `${prefix}.channel`,
        },
        board: {
          ...oldDesc.board,
          id: `${prefix}.board`,
        },
        playbook: {
          ...oldDesc.playbook,
          id: `${prefix}.playbook`,
        },
        integration: {
          ...oldDesc.integration,
          id: `${prefix}.integration`,
          illustration: hasChangedIllustration
            ? oldDesc.integration.illustration
            : `/static/worktemplates/${slugCategory}/${slugUseCase}/integrations.png`,
        },
      };
    });

    if (!hasChangedIllustration) {
      setIllustration(
        `/static/worktemplates/${slugCategory}/${slugUseCase}/${slugUseCase}.png`,
      );
    }
  }, [
    slugCategory,
    slugUseCase,
    hasChangedIllustration,
    hasChangedIntegrationIllustration,
  ]);

  const onChannelDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription((oldDesc) => ({
      ...oldDesc,
      channel: {
        ...oldDesc.channel,
        defaultMessage: e.target.value,
      },
    }));
  };

  const onBoardDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription((oldDesc) => ({
      ...oldDesc,
      board: {
        ...oldDesc.board,
        defaultMessage: e.target.value,
      },
    }));
  };

  const onPlaybookDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription((oldDesc) => ({
      ...oldDesc,
      playbook: {
        ...oldDesc.playbook,
        defaultMessage: e.target.value,
      },
    }));
  };

  const onIntegrationDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription((oldDesc) => ({
      ...oldDesc,
      integration: {
        ...oldDesc.integration,
        defaultMessage: e.target.value,
      },
    }));
  };

  const onIntegrationIllustrationChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setHasChangedIntegrationIllustration(true);
    setDescription((oldDesc) => ({
      ...oldDesc,
      integration: {
        ...oldDesc.integration,
        illustration: e.target.value,
      },
    }));
  };

  const getChannelForPlaybookKey = (key: string) => {
    // find playbook
    const [playbook] = playbooks.filter((pb) => pb.id === key);
    return channels.find((c) => c.playbook === playbook.id)!;
  };

  const playbookSaved = (newPb: Playbook) => {
    setPlaybooks([newPb]);

    // find the generated channel
    const [chan] = channels.filter((c) => c.playbook === newPb.id);
    channelSaved({
      ...chan,
      name: newPb.name,
    });
  };

  const channelSaved = (chan: Channel) => {
    setChannels(channels.map((c) => (c.id === chan.id ? chan : c)));
  };

  const boardSaved = (board: Board) => {
    setBoards(boards.map((b) => (b.id === board.id ? board : b)));
  };

  const addPlaybook = () => {
    const pbKey = `playbook-${new Date().getTime()}`;
    setPlaybooks([
      ...playbooks,
      {
        id: pbKey,
        template: '',
        name: 'New Playbook',
        illustration: `/static/worktemplates/${slugCategory}/${slugUseCase}/${pbKey}.png`,
      },
    ]);

    const chanKey = `channel-${new Date().getTime()}`;
    setChannels([
      {
        id: chanKey,
        illustration: `/static/worktemplates/${slugCategory}/${slugUseCase}/${chanKey}.png`,
        name: 'New Playbook',
        playbook: pbKey,
      },
      ...channels,
    ]);

    setAccordionOpen([...accordionOpen, pbKey, chanKey]);
  };

  const addChannel = () => {
    const key = `channel-${new Date().getTime()}`;
    setChannels([
      ...channels,
      {
        id: key,
        illustration: `/static/worktemplates/${slugCategory}/${slugUseCase}/${key}.png`,
        name: 'New Channel',
      },
    ]);

    setAccordionOpen([...accordionOpen, key]);
  };

  const addBoard = () => {
    const key = `board-${new Date().getTime()}`;
    setBoards([
      ...boards,
      {
        id: key,
        template: '',
        name: 'New Board',
        illustration: `/static/worktemplates/${slugCategory}/${slugUseCase}/${key}.png`,
      },
    ]);

    setAccordionOpen([...accordionOpen, key]);
  };

  const removePlaybook = (key: string) => {
    setAccordionOpen(accordionOpen.filter((k) => k !== key));
    const chan = getChannelForPlaybookKey(key);

    removeChannel(chan.id);
    setPlaybooks(playbooks.filter((pb) => pb.id !== key));
  };

  const removeChannel = (key: string) => {
    setAccordionOpen(accordionOpen.filter((k) => k !== key));
    setChannels(channels.filter((c) => c.id !== key));
  };

  const removeBoard = (key: string) => {
    setAccordionOpen(accordionOpen.filter((k) => k !== key));
    setChannels(channels.filter((c) => c.id !== key));
    setBoards(boards.filter((b) => b.id !== key));
  };

  const removeIntegration = (key: string) => {
    setIntegrations(integrations.filter((i) => i.id !== key));
  };

  const toggleAccordion = (key: string) => {
    if (accordionOpen.includes(key)) {
      setAccordionOpen(accordionOpen.filter((k) => k !== key));
    } else {
      setAccordionOpen([...accordionOpen, key]);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1>Work Template Generator</h1>
        </div>
      </div>

      <div className="row" style={{ marginTop: '1em' }}>
        <div className="col-8">
          <div className="row">
            <div className="col-12">
              <FormGroup>
                <Label>Category</Label>
                <Input
                  type="select"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {Categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>

              <FormGroup>
                <Label>Use Case</Label>
                <Input
                  type="text"
                  name="use-case"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Illustration (204x123)</Label>
                <Input
                  type="text"
                  name="illustration"
                  value={illustration}
                  onChange={(e) => {
                    setHasChangedIllustration(true);
                    setIllustration(e.target.value);
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label>Visibility</Label>
                <div>
                  <ButtonGroup>
                    <Button
                      color="success"
                      outline
                      onClick={() => setVisibility('public')}
                      active={visibility === 'public'}
                    >
                      Public
                    </Button>
                    <Button
                      color="danger"
                      outline
                      onClick={() => setVisibility('private')}
                      active={visibility === 'private'}
                    >
                      Private
                    </Button>
                  </ButtonGroup>
                </div>
              </FormGroup>

              <FormGroup>
                <Label>Feature Flag?</Label>
                <div>
                  <ButtonGroup>
                    <Button
                      color="success"
                      outline
                      onClick={() => setHasFeatureFlag(true)}
                      active={hasFeatureFlag}
                    >
                      Yes
                    </Button>
                    <Button
                      color="danger"
                      outline
                      onClick={() => setHasFeatureFlag(false)}
                      active={!hasFeatureFlag}
                    >
                      No
                    </Button>
                  </ButtonGroup>
                </div>
              </FormGroup>

              {hasFeatureFlag && (
                <>
                  <FormGroup>
                    <Label>Feature Flag Name</Label>
                    <Input
                      type="text"
                      name="feature-flag-name"
                      value={featureFlag.name}
                      onChange={(e) =>
                        setFeatureFlag((ff) => {
                          return { ...ff, name: e.target.value };
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Feature Flag Value</Label>
                    <Input
                      type="text"
                      name="feature-flag-value"
                      value={featureFlag.value}
                      onChange={(e) =>
                        setFeatureFlag((ff) => {
                          return { ...ff, value: e.target.value };
                        })
                      }
                    />
                  </FormGroup>
                </>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h2>Description</h2>
              <FormGroup>
                <Label>Channel</Label>
                <Input
                  type="text"
                  name="description-channel"
                  value={description.channel.defaultMessage}
                  onChange={onChannelDescriptionChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Board</Label>
                <Input
                  type="text"
                  name="description-boards"
                  value={description.board.defaultMessage}
                  onChange={onBoardDescriptionChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Playbook</Label>
                <Input
                  type="text"
                  name="description-playbook"
                  value={description.playbook.defaultMessage}
                  onChange={onPlaybookDescriptionChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Integration description</Label>
                <Input
                  type="text"
                  name="description-integration"
                  value={description.integration.defaultMessage}
                  onChange={onIntegrationDescriptionChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Integration illustration (509x352)</Label>
                <Input
                  type="text"
                  name="illustration-integration"
                  value={description.integration.illustration}
                  onChange={onIntegrationIllustrationChange}
                />
              </FormGroup>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h2>Content</h2>
              <Button
                color="primary"
                onClick={addPlaybook}
                disabled={playbooks.length === 1}
              >
                {playbooks.length === 0 ? '+ Add a playbook' : 'Max 1 Playbook'}
              </Button>
              &nbsp;
              <Button color="primary" onClick={addChannel}>
                + Add a channel
              </Button>
              &nbsp;
              <Button color="primary" onClick={addBoard}>
                + Add a board
              </Button>
            </div>
          </div>

          <Accordion
            open={accordionOpen}
            {...{ toggle: toggleAccordion }} // not pretty but reactstrap ts definition is broken https://github.com/reactstrap/reactstrap/issues/2165
            style={{ marginTop: '1em' }}
          >
            {channels.map((channel) => (
              <>
                <AccordionHeader targetId={channel.id}>
                  Channel: {channel.name}&nbsp;
                  {channel.playbook && (
                    <Badge color="primary">from {channel.playbook}</Badge>
                  )}
                </AccordionHeader>
                <AccordionBody accordionId={channel.id}>
                  <ChannelForm
                    key={channel.id}
                    channel={channel}
                    onChannelSaved={channelSaved}
                  />
                </AccordionBody>
              </>
            ))}

            {boards.map((board) => (
              <>
                <AccordionHeader targetId={board.id}>
                  Board: {board.name}
                </AccordionHeader>
                <AccordionBody accordionId={board.id}>
                  <BoardForm
                    key={board.id}
                    board={board}
                    channels={channels}
                    onBoardSaved={boardSaved}
                  />
                </AccordionBody>
              </>
            ))}

            {playbooks.map((playbook) => (
              <>
                <AccordionHeader targetId={playbook.id}>
                  Playbook: {playbook.name}
                </AccordionHeader>
                <AccordionBody accordionId={playbook.id}>
                  <PlaybookForm
                    key={playbook.id}
                    playbook={playbook}
                    onPlaybookSaved={playbookSaved}
                  />
                </AccordionBody>
              </>
            ))}
          </Accordion>
          <IntegrationForm
            integrations={integrations}
            setIntegrations={setIntegrations}
          />
        </div>
        <div className="col-4">
          <div className="row">
            <div className="col-12">
              <Preview
                category={category}
                useCase={useCase}
                visibility={visibility}
                hasFeatureFlag={hasFeatureFlag}
                featureFlag={featureFlag}
                playbooks={playbooks}
                channels={channels}
                boards={boards}
                integrations={integrations}
                onPlaybookRemoved={removePlaybook}
                onChannelRemoved={removeChannel}
                onBoardRemoved={removeBoard}
                onIntegrationRemoved={removeIntegration}
              />
            </div>
          </div>
        </div>
        <div className="col-12">
          <YamlOutput
            workTemplateId={workTemplateId}
            category={category}
            useCase={useCase}
            illustration={illustration}
            visibility={visibility}
            hasFeatureFlag={hasFeatureFlag}
            featureFlag={featureFlag}
            description={description}
            boards={boards}
            channels={channels}
            playbooks={playbooks}
            integrations={integrations}
          />
        </div>
      </div>
    </div>
  );
}

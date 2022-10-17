import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { Board, Channel } from './types';

interface BoardFormProps {
  board: Board;
  channels: Channel[];
  onBoardSaved: (board: Board) => void;
}

// Key is the [properties.trackingTemplateId] of the template.
// Stored on team 0
const Templates = [
  { key: "54fcf9c610f0ac5e4c522c0657c90602", name: "Meeting Agenda", illustration: "" },
  { key: "dfb70c146a4584b8a21837477c7b5431", name: "Personal Tasks", illustration: "" },
  { key: "a4ec399ab4f2088b1051c3cdf1dde4c3", name: "Project Tasks", illustration: "" },
  { key: "7f32dc8d2ae008cfe56554e9363505cc", name: "Personal Goals", illustration: "" },
  { key: "c75fbd659d2258b5183af2236d176ab4", name: "Content Calendar", illustration: "" },
  { key: "b728c6ca730e2cfc229741c5a4712b65", name: "Roadmap", illustration: "" },
]

export function BoardForm(props: BoardFormProps) {
  const board = props.board;

  const updateBoard = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newBoard = {
      ...board,
      [e.target.name]: e.target.value
    };

    if (e.target.name === 'template' && newBoard.illustration === '') {
      newBoard.illustration = Templates.find(t => t.key === newBoard.template)?.illustration || '';
    }

    props.onBoardSaved(newBoard);
  };


  return (
    <div className='row'>
      <div className='col-12'>
        <FormGroup>
          <Label>Template</Label>
          <Input type='select' name='template' value={board.template} onChange={updateBoard}>
            <option value={''}></option>
            {Templates.map((template) => (
              <option key={template.key} value={template.key}>{template.name}</option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label >Name</Label>
          <Input type='text' name='name' value={board.name} onChange={updateBoard} />
        </FormGroup>

        <FormGroup>
          <Label >Illustration</Label>
          <Input type='text' name='illustration' value={board.illustration} onChange={updateBoard} />
        </FormGroup>

        <FormGroup>
          <Label >Link to a channel</Label>
          <Input type='select' name='channel' value={board.channel} onChange={updateBoard}>
            <option value=''>None</option>
            {props.channels.map(channel => <option key={channel.id} value={channel.id}>{channel.name}</option>)}
          </Input>
        </FormGroup>
      </div>
    </div>
  );
}


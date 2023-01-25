import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { Board, Channel } from '../types';

interface BoardFormProps {
  board: Board;
  channels: Channel[];
  onBoardSaved: (board: Board) => void;
}

// Key is the [properties.trackingTemplateId] of the template.
// Stored on team 0
const Templates = [
  { name: 'Company Goals & OKRs', key: '7ba22ccfdfac391d63dea5c4b8cde0de' },
  { name: 'Competitive Analysis', key: '06f4bff367a7c2126fab2380c9dec23c' },
  { name: 'Content Calendar ', key: 'c75fbd659d2258b5183af2236d176ab4' },
  { name: 'Meeting Agenda ', key: '54fcf9c610f0ac5e4c522c0657c90602' },
  { name: 'Personal Goals ', key: '7f32dc8d2ae008cfe56554e9363505cc' },
  { name: 'Personal Tasks ', key: 'dfb70c146a4584b8a21837477c7b5431' },
  { name: 'Project Tasks ', key: 'a4ec399ab4f2088b1051c3cdf1dde4c3' },
  { name: 'Roadmap ', key: 'b728c6ca730e2cfc229741c5a4712b65' },
  { name: 'Sales Pipeline CRM', key: 'ecc250bb7dff0fe02247f1110f097544' },
  { name: 'Sprint Planner ', key: '99b74e26d2f5d0a9b346d43c0a7bfb09' },
  { name: 'Team Retrospective', key: 'e4f03181c4ced8edd4d53d33d569a086' },
  { name: 'User Research Sessions', key: '6c345c7f50f6833f78b7d0f08ce450a3' },
];

export function BoardForm(props: BoardFormProps) {
  const board = props.board;

  const updateBoard = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newBoard = {
      ...board,
      [e.target.name]: e.target.value,
    };

    props.onBoardSaved(newBoard);
  };

  return (
    <div className="row">
      <div className="col-12">
        <FormGroup>
          <Label>Template</Label>
          <Input
            type="select"
            name="template"
            value={board.template}
            onChange={updateBoard}
          >
            <option value={''}></option>
            {Templates.map((template) => (
              <option key={template.key} value={template.key}>
                {template.name}
              </option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={board.name}
            onChange={updateBoard}
          />
        </FormGroup>

        <FormGroup>
          <Label>Illustration (509x352)</Label>
          <Input
            type="text"
            name="illustration"
            value={board.illustration}
            onChange={updateBoard}
          />
        </FormGroup>

        <FormGroup>
          <Label>Link to a channel</Label>
          <Input
            type="select"
            name="channel"
            value={board.channel}
            onChange={updateBoard}
          >
            <option value="">None</option>
            {props.channels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </Input>
        </FormGroup>
      </div>
    </div>
  );
}

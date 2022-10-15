import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { Board, Channel } from './types';

interface BoardFormProps {
    board: Board;
    channels: Channel[];
    onBoardSaved: (board: Board) => void;
}

const Templates = [
    { key: 'template-1', name: 'Template 1', illustration: '/test-1.png' },
    { key: 'template-2', name: 'Template 2', illustration: '' },
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


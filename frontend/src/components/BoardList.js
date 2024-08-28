import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBoards, createBoard } from '../api';

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getBoards()
      .then((data) => {
        if (Array.isArray(data)) {
          setBoards(data);
        } else {
          console.error('Unexpected data format:', data);
          setBoards([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching boards:', error);
        setBoards([]);
      });
  }, []);

  const handleCreateBoard = async () => {
    if (newBoardName.trim() === '') return;

    try {
      const board = await createBoard(newBoardName);
      setBoards((prevBoards) => [...prevBoards, board]);
      navigate(`/board/${board.id}`);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Available Boards</h1>
      <ul>
        {boards && boards.length > 0 ? (
          boards.map((board) => (
            <li key={board.id}>
              <Link to={`/board/${board.id}`}>{board.name}</Link>
            </li>
          ))
        ) : (
          <p>No boards available.</p>
        )}
      </ul>
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="New Board Name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
        />
        <button onClick={handleCreateBoard}>Create Board</button>
      </div>
    </div>
  );
};

export default BoardList;

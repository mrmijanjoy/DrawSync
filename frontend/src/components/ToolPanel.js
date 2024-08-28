import React from 'react';
import { FaPencilAlt, FaEraser, FaSquare, FaCircle, FaTrashAlt, FaSave } from 'react-icons/fa';
import Draggable from 'react-draggable';

const ToolPanel = ({ setTool, setColor, clearCanvas, exportToJPEG, selectedTool, toolColor }) => {
  const getButtonStyle = (tool) => ({
    ...toolButtonStyle,
    backgroundColor: selectedTool === tool ? toolColor : 'rgba(255, 255, 255, 0.2)', // Highlight selected tool
  });

  return (
    <Draggable>
      <div style={{ //==========================panel style============
        width: '250px',
        height: '60vh',
        borderRight: '2px solid rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(180deg, #4A90E2 0%, #50C9C3 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '15px',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        color: '#fff',
        overflow: 'hidden',
      }}>
        <button onClick={() => setTool('pen')} title="Pen" style={getButtonStyle('pen')}>
          <FaPencilAlt />
        </button>
        <button onClick={() => setTool('eraser')} title="Eraser" style={getButtonStyle('eraser')}>
          <FaEraser />
        </button>
        <button onClick={() => setTool('rectangle')} title="Rectangle" style={getButtonStyle('rectangle')}>
          <FaSquare />
        </button>
        <button onClick={() => setTool('circle')} title="Circle" style={getButtonStyle('circle')}>
          <FaCircle />
        </button>
        <button onClick={clearCanvas} title="Clear Canvas" style={toolButtonStyle}>
          <FaTrashAlt />
        </button>
        <button onClick={exportToJPEG} title="Export to JPEG" style={toolButtonStyle}>
          <FaSave />
        </button>
        <input
          type="color"
          onChange={(e) => setColor(e.target.value)}
          style={{
            marginTop: '15px',
            border: 'none',
            borderRadius: '5px',
            padding: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'box-shadow 0.3s ease',
          }}
        />
      </div>
    </Draggable>
  );
};

const toolButtonStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  border: 'none',
  borderRadius: '10px',
  marginBottom: '10px',
  padding: '15px',
  fontSize: '18px',
  color: '#fff',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
};

export default ToolPanel;

import React, { useState } from 'react';
import { FaPencilAlt, FaEraser, FaSquare, FaCircle, FaTrashAlt, FaSave, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Draggable from 'react-draggable';

const ToolPanel = ({ setTool, setColor, clearCanvas, exportToJPEG }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Draggable>
      <div style={{ 
        width: isCollapsed ? '60px' : '200px', 
        height: '100vh', 
        borderRight: '1px solid #ccc', 
        backgroundColor: '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        position: 'relative'
      }}>
        <button 
          onClick={toggleCollapse} 
          style={{ position: 'absolute', top: '10px', right: '-30px', backgroundColor: '#ddd', border: 'none', borderRadius: '50%' }}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        {!isCollapsed && (
          <>
            <button onClick={() => setTool('pen')} title="Pen">
              <FaPencilAlt />
            </button>
            <button onClick={() => setTool('eraser')} title="Eraser">
              <FaEraser />
            </button>
            <button onClick={() => setTool('rectangle')} title="Rectangle">
              <FaSquare />
            </button>
            <button onClick={() => setTool('circle')} title="Circle">
              <FaCircle />
            </button>
            <button onClick={clearCanvas} title="Clear Canvas">
              <FaTrashAlt />
            </button>
            <button onClick={exportToJPEG} title="Export to JPEG">
              <FaSave />
            </button>
            <input
              type="color"
              onChange={(e) => setColor(e.target.value)}
              style={{ marginTop: '10px' }}
            />
          </>
        )}
      </div>
    </Draggable>
  );
};

export default ToolPanel;

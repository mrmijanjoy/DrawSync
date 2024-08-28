import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stage, Layer, Line, Rect, Circle } from 'react-konva';
import { getBoard, saveDrawing } from '../api';
import ToolPanel from './ToolPanel';
import { saveAs } from 'file-saver';
import { checkIntersection } from 'line-intersect'; // for erasing

const Board = () => {
  const { id } = useParams();
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [currentShape, setCurrentShape] = useState(null);
  const [boardName, setBoardName] = useState('');
  const [eraserPath, setEraserPath] = useState([]); 

  useEffect(() => {
    getBoard(id)
      .then((data) => {
        if (data && data.lines) {
          setLines(data.lines);
          setBoardName(data.name); 
        } else {
          console.error('Unexpected data format:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching board data:', error);
      });
  }, [id]);

//mouse down move
const handleMouseDown = (e) => {
  setIsDrawing(true);
  const { x, y } = e.target.getStage().getPointerPosition();
  //eraser
  if (tool === 'eraser') {
    setEraserPath([{ x, y }]);
    return;
  }
  //rectangle and circle
  if (tool === 'rectangle' || tool === 'circle') {
    setCurrentShape({ tool, x, y, color });
  } else {
    setLines([...lines, { points: [x, y], tool, color }]);
  }
};

const handleMouseMove = (e) => {
  if (!isDrawing) return;
  const { x, y } = e.target.getStage().getPointerPosition();
  //eraser
  if (tool === 'eraser') {
    setEraserPath(prev => [...prev, { x, y }]);
    return;
  }
  //rectangle and circle
  if (tool === 'rectangle' || tool === 'circle') {
    setCurrentShape(prev => ({ ...prev, width: x - prev.x, height: y - prev.y }));
  } else {
    const newLines = [...lines];
    if (newLines.length > 0) {
      newLines[newLines.length - 1].points = [...newLines[newLines.length - 1].points, x, y];
      setLines(newLines);
    }
  }
};

//mouse up move
  const handleMouseUp = () => {
    setIsDrawing(false);

    //rectangle and circle
    if (tool === 'rectangle' || tool === 'circle') {
      setLines([...lines, currentShape]);
      setCurrentShape(null);
    }
    //eraser
    if (tool === 'eraser') {
      eraseFromDrawing(); 
      setEraserPath([]);
    }

    saveDrawing(id, { lines })
      .then(() => console.log('Drawing saved'))
      .catch((error) => console.error('Error saving drawing:', error));
  };

  const eraseFromDrawing = () => {
    const newLines = lines.filter(line => !isLineIntersectingEraserPath(line));
    setLines(newLines);
  };

  //erasing
  const isLineIntersectingEraserPath = (line) => {
    if (!line.points || line.points.length < 4) return false;
    if (eraserPath.length < 2) return false;
  
    const eraserSegments = [];
    for (let i = 0; i < eraserPath.length - 1; i++) {
      eraserSegments.push([eraserPath[i], eraserPath[i + 1]]);
    }
  
    return eraserSegments.some(([start, end]) => {
      return checkIntersection(
        line.points[0], line.points[1],
        line.points[2], line.points[3],
        start.x, start.y,
        end.x, end.y
      );
    });
  };  

//clear canvas
  const clearCanvas = () => {
    setLines([]);
    saveDrawing(id, { lines: [] })
      .then(() => console.log('Canvas cleared'))
      .catch((error) => console.error('Error clearing canvas:', error));
  };

//export to jpeg
const exportToJPEG = () => {
  const stage = document.querySelector('canvas');
  if (!stage) return;

  // temporary canvas
  const tempCanvas = document.createElement('canvas');
  const context = tempCanvas.getContext('2d');
  tempCanvas.width = stage.width;
  tempCanvas.height = stage.height;

  // background
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Draw to temporary canvas
  context.drawImage(stage, 0, 0);

  // Convert to JPEG
  const dataURL = tempCanvas.toDataURL('image/jpeg');
  saveAs(dataURL, 'drawing.jpg');
};


  //drawing
  const renderShape = (shape, index) => {
    switch (shape.tool) {
      case 'rectangle':
        return (
          <Rect
            key={index}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            stroke={shape.color} 
            strokeWidth={3}
          />
        );
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(shape.width, 2) + Math.pow(shape.height, 2)
        ) / 2;
        return (
          <Circle
            key={index}
            x={shape.x + shape.width / 2}
            y={shape.y + shape.height / 2}
            radius={radius}
            stroke={shape.color}
            strokeWidth={3}
          />
        );
      default:
        return (
          <Line
            key={index}
            points={shape.points}
            stroke={shape.color}
            strokeWidth={3}
            lineCap="round"
            lineJoin="round"
          />
        );
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#f8f9fa',
    }}>
      <header style={{
        width: '100%',
        padding: '20px',
        background: 'linear-gradient(90deg, #4A90E2 0%, #50C9C3 100%)',
        color: '#ffffff',
        textAlign: 'center',
        fontSize: '1.5rem',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1,
      }}>
        Drawing Board: {id} 
      </header>
      <div style={{
        display: 'flex',
        flex: 1,
        marginTop: '-4px', 
        overflow: 'hidden', 
      }}>
        <ToolPanel 
          setTool={setTool} 
          setColor={setColor} 
          clearCanvas={clearCanvas} 
          exportToJPEG={exportToJPEG} 
        />
        <div style={{
          flex: 1,
          padding: '20px',
          boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          margin: '20px',
          marginTop: '40px',
        }}>
          <Stage
            width={window.innerWidth - 300} 
            height={window.innerHeight - 140} 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              border: 'none', 
              borderRadius: '10px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Layer>
              {lines.map((line, index) => renderShape(line, index))}
              {currentShape && renderShape(currentShape, lines.length)}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default Board;

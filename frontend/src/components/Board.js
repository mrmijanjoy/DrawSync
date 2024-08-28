import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stage, Layer, Line, Rect, Circle } from 'react-konva';
import { getBoard, saveDrawing } from '../api';
import ToolPanel from './ToolPanel';
import { saveAs } from 'file-saver';

const Board = () => {
  const { id } = useParams();
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [currentShape, setCurrentShape] = useState(null);

  useEffect(() => {
    getBoard(id)
      .then((data) => {
        if (Array.isArray(data.lines)) {
          setLines(data.lines);
        } else {
          console.error('Unexpected data format:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching board data:', error);
      });
  }, [id]);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { x, y } = e.target.getStage().getPointerPosition();
    if (tool === 'eraser') {
      // Implement eraser logic here
      return;
    }
    if (tool === 'rectangle' || tool === 'circle') {
      setCurrentShape({ tool, x, y, color });
    } else {
      setLines([...lines, { points: [x, y], tool, color }]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    if (tool === 'rectangle' || tool === 'circle') {
      setCurrentShape(prev => ({ ...prev, width: x - prev.x, height: y - prev.y }));
    } else {
      const newLines = [...lines];
      newLines[newLines.length - 1].points = [...newLines[newLines.length - 1].points, x, y];
      setLines(newLines);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (tool === 'rectangle' || tool === 'circle') {
      setLines([...lines, currentShape]);
      setCurrentShape(null);
    }
    saveDrawing(id, { lines })
      .then(() => console.log('Drawing saved'))
      .catch((error) => console.error('Error saving drawing:', error));
  };

  const clearCanvas = () => {
    setLines([]);
    saveDrawing(id, { lines: [] })
      .then(() => console.log('Canvas cleared'))
      .catch((error) => console.error('Error clearing canvas:', error));
  };

  const exportToJPEG = () => {
    const stage = document.querySelector('canvas');
    if (stage) {
      const dataURL = stage.toDataURL('image/jpeg');
      saveAs(dataURL, 'drawing.jpg');
    }
  };

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
            fill={shape.color}
            stroke="black"
            strokeWidth={2}
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
            fill={shape.color}
            stroke="black"
            strokeWidth={2}
          />
        );
      default:
        return (
          <Line
            key={index}
            points={shape.points}
            stroke={shape.color}
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
          />
        );
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ToolPanel 
        setTool={setTool} 
        setColor={setColor} 
        clearCanvas={clearCanvas} 
        exportToJPEG={exportToJPEG} 
      />
      <div style={{ flex: 1 }}>
        <Stage
          width={window.innerWidth - 220} // Adjust width based on tool panel width
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {lines.map((line, index) => renderShape(line, index))}
            {currentShape && renderShape(currentShape, lines.length)}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Board;

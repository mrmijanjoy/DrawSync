// frontend/src/api.js

const API_URL = 'http://localhost:5000/api';

export const getBoards = async () => {
  try {
    const response = await fetch(`${API_URL}/boards`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching boards:', error);
    return [];
  }
};

export const createBoard = async (name) => {
  try {
    const response = await fetch(`${API_URL}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating board:', error);
    throw error;
  }
};

export const getBoard = async (id) => {
  try {
    const response = await fetch(`${API_URL}/boards/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching board data:', error);
    throw error;
  }
};

export const saveDrawing = async (id, drawingData) => {
  try {
    const response = await fetch(`${API_URL}/boards/${id}/draw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(drawingData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error saving drawing:', error);
    throw error;
  }
};

import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

function App() {
    const [photos, setPhotos] = useState([]);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editMode, setEditMode] = useState(null); // which photo it is targeted 

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const result = await axios.get(`${BASE_URL}/photos`);
                setPhotos(result.data);
            } catch (error) {
                console.error('Failed to fetch photos:', error);
            }
        };
        fetchPhotos();
    }, []);

    const handleFileChange = event => setFile(event.target.files[0]);
    const handleDescriptionChange = event => setDescription(event.target.value);
    const handleEdit = photo => {
        setEditMode(photo.filename);
        setEditDesc(photo.description);
    };

    const handleEditChange = event => setEditDesc(event.target.value);

    const handleUpdate = async (filename) => {
      try {
          await axios.put(`${BASE_URL}/update/${filename}`, { description: editDesc });
          const updatedPhotos = photos.map(photo => {
              if (photo.filename === filename) {
                  return { ...photo, description: editDesc };
              }
              return photo;
          });
          setPhotos(updatedPhotos);
          setEditMode(null);
          setEditDesc('');
      } catch (error) {
          console.error('Failed to update description:', error);
      }
    };
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('description', description);

        try {
            const response = await axios.post(`${BASE_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPhotos([...photos, response.data]);
            setDescription('');
            setFile(null);
        } catch (error) {
            console.error('Failed to upload photo:', error);
        }
    };

    const handleDelete = async (filename) => {
        try {
            await axios.delete(`${BASE_URL}/delete/${filename}`);
            setPhotos(photos.filter(photo => photo.filename !== filename));
        } catch (error) {
            console.error('Failed to delete photo:', error);
        }
    };

    return (
        <div className="app-container">
            <form onSubmit={handleSubmit} className="upload-form">
                <input type="file" onChange={handleFileChange} />
                <input type="text" value={description} onChange={handleDescriptionChange} placeholder="Description" />
                <button type="submit">Upload Photo</button>
            </form>
            <div className="photo-grid">
                {photos.map((photo, index) => (
                    <div className="photo-item" key={index}>
                        <img src={`${BASE_URL}/${photo.filename}`} alt={photo.description} />
                        {editMode === photo.filename ? (
                            <input type="text" value={editDesc} onChange={handleEditChange} placeholder="Edit Description" />
                        ) : (
                            <p>{photo.description}</p>
                        )}
                        {editMode === photo.filename ? (
                            <button onClick={() => handleUpdate(photo.filename)}>Update</button>
                        ) : (
                            <button onClick={() => handleEdit(photo)}>Edit</button>
                        )}
                        <button onClick={() => handleDelete(photo.filename)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;

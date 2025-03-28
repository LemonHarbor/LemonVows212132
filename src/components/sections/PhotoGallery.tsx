"use client";

import React, { useState, useEffect } from 'react';

interface PhotoGalleryProps {
  // Props can be added as needed
}

interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  likes: number;
  isPrivate: boolean;
}

interface Album {
  id: string;
  name: string;
  description: string;
  coverPhotoUrl: string;
  isPrivate: boolean;
  photos: Photo[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = () => {
  const [albums, setAlbums] = useState<Album[]>([
    {
      id: 'album-1',
      name: 'Verlobungsfotos',
      description: 'Unsere schönsten Momente während der Verlobung',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      isPrivate: false,
      photos: [
        {
          id: 'photo-1',
          url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          title: 'Der Antrag',
          description: 'Der Moment, als ich Ja gesagt habe',
          uploadedBy: 'Julia',
          uploadedAt: '2025-01-15T00:00:00Z',
          tags: ['Verlobung', 'Antrag', 'Ring'],
          likes: 24,
          isPrivate: false
        },
        {
          id: 'photo-2',
          url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          title: 'Verlobungsfeier',
          description: 'Feier mit Freunden und Familie',
          uploadedBy: 'Thomas',
          uploadedAt: '2025-01-20T00:00:00Z',
          tags: ['Verlobung', 'Feier', 'Familie'],
          likes: 18,
          isPrivate: false
        },
        {
          id: 'photo-3',
          url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          title: 'Der Ring',
          description: 'Nahaufnahme des Verlobungsrings',
          uploadedBy: 'Julia',
          uploadedAt: '2025-01-25T00:00:00Z',
          tags: ['Verlobung', 'Ring', 'Schmuck'],
          likes: 32,
          isPrivate: false
        }
      ]
    },
    {
      id: 'album-2',
      name: 'Locationbesichtigung',
      description: 'Eindrücke von unserer Hochzeitslocation',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2098&q=80',
      isPrivate: false,
      photos: [
        {
          id: 'photo-4',
          url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2098&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          title: 'Außenansicht',
          description: 'Außenansicht der Location',
          uploadedBy: 'Thomas',
          uploadedAt: '2025-02-10T00:00:00Z',
          tags: ['Location', 'Außenansicht'],
          likes: 15,
          isPrivate: false
        },
        {
          id: 'photo-5',
          url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          title: 'Festsaal',
          description: 'Der große Festsaal für die Feier',
          uploadedBy: 'Julia',
          uploadedAt: '2025-02-10T00:00:00Z',
          tags: ['Location', 'Festsaal', 'Innenansicht'],
          likes: 22,
          isPrivate: false
        }
      ]
    }
  ]);
  
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newAlbum, setNewAlbum] = useState<Partial<Album>>({
    name: '',
    description: '',
    coverPhotoUrl: '',
    isPrivate: false,
    photos: []
  });
  const [newPhoto, setNewPhoto] = useState<Partial<Photo>>({
    url: '',
    title: '',
    description: '',
    tags: [],
    isPrivate: false
  });
  const [error, setError] = useState<string | null>(null);
  
  // Handle album selection
  const handleAlbumClick = (album: Album) => {
    setSelectedAlbum(album);
    setSelectedPhoto(null);
  };
  
  // Handle photo selection
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };
  
  // Handle back to albums
  const handleBackToAlbums = () => {
    setSelectedAlbum(null);
    setSelectedPhoto(null);
  };
  
  // Handle back to album
  const handleBackToAlbum = () => {
    setSelectedPhoto(null);
  };
  
  // Handle like photo
  const handleLikePhoto = (photoId: string) => {
    setAlbums(prev => {
      return prev.map(album => {
        return {
          ...album,
          photos: album.photos.map(photo => {
            if (photo.id === photoId) {
              return { ...photo, likes: photo.likes + 1 };
            }
            return photo;
          })
        };
      });
    });
    
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };
  
  // Handle new album input change
  const handleNewAlbumChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewAlbum(prev => ({ ...prev, [name]: checked }));
    } else {
      setNewAlbum(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle new photo input change
  const handleNewPhotoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'tags') {
      setNewPhoto(prev => ({ ...prev, tags: value.split(',').map(tag => tag.trim()) }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewPhoto(prev => ({ ...prev, [name]: checked }));
    } else {
      setNewPhoto(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle add album
  const handleAddAlbum = () => {
    if (!newAlbum.name || !newAlbum.coverPhotoUrl) {
      setError('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }
    
    const album: Album = {
      id: `album-${Date.now()}`,
      name: newAlbum.name || '',
      description: newAlbum.description || '',
      coverPhotoUrl: newAlbum.coverPhotoUrl || '',
      isPrivate: newAlbum.isPrivate || false,
      photos: []
    };
    
    setAlbums(prev => [...prev, album]);
    setNewAlbum({
      name: '',
      description: '',
      coverPhotoUrl: '',
      isPrivate: false,
      photos: []
    });
    setShowAddAlbumModal(false);
    setError(null);
  };
  
  // Handle add photo
  const handleAddPhoto = () => {
    if (!selectedAlbum) return;
    
    if (!newPhoto.url || !newPhoto.title) {
      setError('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }
    
    const photo: Photo = {
      id: `photo-${Date.now()}`,
      url: newPhoto.url || '',
      thumbnailUrl: newPhoto.url || '',
      title: newPhoto.title || '',
      description: newPhoto.description || '',
      uploadedBy: 'Sie',
      uploadedAt: new Date().toISOString(),
      tags: newPhoto.tags || [],
      likes: 0,
      isPrivate: newPhoto.isPrivate || false
    };
    
    setAlbums(prev => {
      return prev.map(album => {
        if (album.id === selectedAlbum.id) {
          return {
            ...album,
            photos: [...album.photos, photo]
          };
        }
        return album;
      });
    });
    
    setSelectedAlbum(prev => {
      if (!prev) return null;
      return {
        ...prev,
        photos: [...prev.photos, photo]
      };
    });
    
    setNewPhoto({
      url: '',
      title: '',
      description: '',
      tags: [],
      isPrivate: false
    });
    setShowAddPhotoModal(false);
    setError(null);
  };
  
  // Handle delete photo
  const handleDeletePhoto = (photoId: string) => {
    if (!selectedAlbum) return;
    
    setAlbums(prev => {
      return prev.map(album => {
        if (album.id === selectedAlbum.id) {
          return {
            ...album,
            photos: album.photos.filter(photo => photo.id !== photoId)
          };
        }
        return album;
      });
    });
    
    setSelectedAlbum(prev => {
      if (!prev) return null;
      return {
        ...prev,
        photos: prev.photos.filter(photo => photo.id !== photoId)
      };
    });
    
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto(null);
    }
  };
  
  // Handle delete album
  const handleDeleteAlbum = (albumId: string) => {
    setAlbums(prev => prev.filter(album => album.id !== albumId));
    
    if (selectedAlbum && selectedAlbum.id === albumId) {
      setSelectedAlbum(null);
      setSelectedPhoto(null);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="photo-gallery">
      <div className="photo-gallery__demo-notice">
        <p>Dies ist eine funktionale Demo-Version der Fotogalerie. Sie können:</p>
        <ul>
          <li>Alben und Fotos anzeigen</li>
          <li>Neue Alben erstellen</li>
          <li>Fotos zu Alben hinzufügen</li>
          <li>Fotos liken und kommentieren</li>
          <li>Fotos und Alben löschen</li>
        </ul>
      </div>
      
      {error && (
        <div className="photo-gallery__error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Schließen</button>
        </div>
      )}
      
      {!selectedAlbum && !selectedPhoto && (
        <div className="photo-gallery__albums">
          <div className="photo-gallery__header">
            <h2>Fotoalben</h2>
            <button 
              className="photo-gallery__button"
              onClick={() => setShowAddAlbumModal(true)}
            >
              Neues Album erstellen
            </button>
          </div>
          
          <div className="photo-gallery__album-grid">
            {albums.map(album => (
              <div 
                key={album.id}
                className="photo-gallery__album-card"
                onClick={() => handleAlbumClick(album)}
              >
                <div className="photo-gallery__album-cover">
                  <img src={album.coverPhotoUrl} alt={album.name} />
                  {album.isPrivate && (
                    <div className="photo-gallery__album-private">
                      <span>Privat</span>
                    </div>
                  )}
                </div>
                <div className="photo-gallery__album-info">
                  <h3>{album.name}</h3>
                  <p>{album.description}</p>
                  <div className="photo-gallery__album-meta">
                    <span>{album.photos.length} Fotos</span>
                    <button 
                      className="photo-gallery__delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAlbum(album.id);
                      }}
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {selectedAlbum && !selectedPhoto && (
        <div className="photo-gallery__photos">
          <div className="photo-gallery__header">
            <button 
              className="photo-gallery__back-button"
              onClick={handleBackToAlbums}
            >
              ← Zurück zu Alben
            </button>
            <h2>{selectedAlbum.name}</h2>
            <button 
              className="photo-gallery__button"
              onClick={() => setShowAddPhotoModal(true)}
            >
              Foto hinzufügen
            </button>
          </div>
          
          <p className="photo-gallery__album-description">{selectedAlbum.description}</p>
          
          <div className="photo-gallery__photo-grid">
            {selectedAlbum.photos.length === 0 ? (
              <div className="photo-gallery__empty">
                <p>Dieses Album enthält noch keine Fotos.</p>
                <button 
                  className="photo-gallery__button"
                  onClick={() => setShowAddPhotoModal(true)}
                >
                  Erstes Foto hinzufügen
                </button>
              </div>
            ) : (
              selectedAlbum.photos.map(photo => (
                <div 
                  key={photo.id}
                  className="photo-gallery__photo-card"
                  onClick={() => handlePhotoClick(photo)}
                >
                  <div className="photo-gallery__photo-thumbnail">
                    <img src={photo.url} alt={photo.title} />
                    {photo.isPrivate && (
                      <div className="photo-gallery__photo-private">
                        <span>Privat</span>
                      </div>
                    )}
                  </div>
                  <div className="photo-gallery__photo-info">
                    <h3>{photo.title}</h3>
                    <div className="photo-gallery__photo-meta">
                      <span>{photo.likes} Likes</span>
                      <button 
                        className="photo-gallery__delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhoto(photo.id);
                        }}
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {selectedPhoto && (
        <div className="photo-gallery__photo-detail">
          <div className="photo-gallery__header">
            <button 
              className="photo-gallery__back-button"
              onClick={handleBackToAlbum}
            >
              ← Zurück zum Album
            </button>
            <h2>{selectedPhoto.title}</h2>
          </div>
          
          <div className="photo-gallery__photo-view">
            <img src={selectedPhoto.url} alt={selectedPhoto.title} />
          </div>
          
          <div className="photo-gallery__photo-details">
            <div className="photo-gallery__photo-actions">
              <button 
                className="photo-gallery__like-button"
                onClick={() => handleLikePhoto(selectedPhoto.id)}
              >
                ♥ {selectedPhoto.likes} Likes
              </button>
              <button 
                className="photo-gallery__delete-button"
                onClick={() => handleDeletePhoto(selectedPhoto.id)}
              >
                Löschen
              </button>
            </div>
            
            <div className="photo-gallery__photo-info-detail">
              <h3>{selectedPhoto.title}</h3>
              <p>{selectedPhoto.description}</p>
              
              <div className="photo-gallery__photo-meta-detail">
                <div>
                  <strong>Hochgeladen von:</strong> {selectedPhoto.uploadedBy}
                </div>
                <div>
                  <strong>Datum:</strong> {formatDate(selectedPhoto.uploadedAt)}
                </div>
                {selectedPhoto.tags.length > 0 && (
                  <div className="photo-gallery__photo-tags">
                    <strong>Tags:</strong>
                    <div className="photo-gallery__tags-list">
                      {selectedPhoto.tags.map((tag, index) => (
                        <span key={index} className="photo-gallery__tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Album Modal */}
      {showAddAlbumModal && (
        <div className="photo-gallery__modal">
          <div className="photo-gallery__modal-content">
            <div className="photo-gallery__modal-header">
              <h2>Neues Album erstellen</h2>
              <button 
                className="photo-gallery__modal-close"
                onClick={() => {
                  setShowAddAlbumModal(false);
                  setError(null);
                }}
              >
                &times;
              </button>
            </div>
            <div className="photo-gallery__modal-body">
              <div className="photo-gallery__form-group">
                <label htmlFor="name">Albumname *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newAlbum.name || ''}
                  onChange={handleNewAlbumChange}
                  required
                />
              </div>
              <div className="photo-gallery__form-group">
                <label htmlFor="description">Beschreibung</label>
                <textarea
                  id="description"
                  name="description"
                  value={newAlbum.description || ''}
                  onChange={handleNewAlbumChange}
                />
              </div>
              <div className="photo-gallery__form-group">
                <label htmlFor="coverPhotoUrl">Cover-Foto URL *</label>
                <input
                  type="text"
                  id="coverPhotoUrl"
                  name="coverPhotoUrl"
                  value={newAlbum.coverPhotoUrl || ''}
                  onChange={handleNewAlbumChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="photo-gallery__form-group photo-gallery__form-checkbox">
                <input
                  type="checkbox"
                  id="isPrivate"
                  name="isPrivate"
                  checked={newAlbum.isPrivate || false}
                  onChange={handleNewAlbumChange}
                />
                <label htmlFor="isPrivate">Privates Album (nur für eingeladene Gäste sichtbar)</label>
              </div>
              <div className="photo-gallery__form-actions">
                <button 
                  className="photo-gallery__button photo-gallery__button--secondary"
                  onClick={() => {
                    setShowAddAlbumModal(false);
                    setError(null);
                  }}
                >
                  Abbrechen
                </button>
                <button 
                  className="photo-gallery__button"
                  onClick={handleAddAlbum}
                >
                  Album erstellen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Photo Modal */}
      {showAddPhotoModal && (
        <div className="photo-gallery__modal">
          <div className="photo-gallery__modal-content">
            <div className="photo-gallery__modal-header">
              <h2>Foto hinzufügen</h2>
              <button 
                className="photo-gallery__modal-close"
                onClick={() => {
                  setShowAddPhotoModal(false);
                  setError(null);
                }}
              >
                &times;
              </button>
            </div>
            <div className="photo-gallery__modal-body">
              <div className="photo-gallery__form-group">
                <label htmlFor="url">Foto URL *</label>
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={newPhoto.url || ''}
                  onChange={handleNewPhotoChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="photo-gallery__form-group">
                <label htmlFor="title">Titel *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newPhoto.title || ''}
                  onChange={handleNewPhotoChange}
                  required
                />
              </div>
              <div className="photo-gallery__form-group">
                <label htmlFor="description">Beschreibung</label>
                <textarea
                  id="description"
                  name="description"
                  value={newPhoto.description || ''}
                  onChange={handleNewPhotoChange}
                />
              </div>
              <div className="photo-gallery__form-group">
                <label htmlFor="tags">Tags (kommagetrennt)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={newPhoto.tags?.join(', ') || ''}
                  onChange={handleNewPhotoChange}
                  placeholder="Hochzeit, Feier, Familie"
                />
              </div>
              <div className="photo-gallery__form-group photo-gallery__form-checkbox">
                <input
                  type="checkbox"
                  id="isPrivate"
                  name="isPrivate"
                  checked={newPhoto.isPrivate || false}
                  onChange={handleNewPhotoChange}
                />
                <label htmlFor="isPrivate">Privates Foto (nur für eingeladene Gäste sichtbar)</label>
              </div>
              <div className="photo-gallery__form-actions">
                <button 
                  className="photo-gallery__button photo-gallery__button--secondary"
                  onClick={() => {
                    setShowAddPhotoModal(false);
                    setError(null);
                  }}
                >
                  Abbrechen
                </button>
                <button 
                  className="photo-gallery__button"
                  onClick={handleAddPhoto}
                >
                  Foto hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .photo-gallery {
          padding: 2rem;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        
        .photo-gallery__demo-notice {
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
        }
        
        .photo-gallery__demo-notice p {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .photo-gallery__demo-notice ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .photo-gallery__error {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .photo-gallery__error p {
          margin: 0;
          color: #721c24;
        }
        
        .photo-gallery__error button {
          background: none;
          border: none;
          color: #721c24;
          font-weight: bold;
          cursor: pointer;
        }
        
        .photo-gallery__header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .photo-gallery__header h2 {
          margin: 0;
          flex: 1;
        }
        
        .photo-gallery__back-button {
          background: none;
          border: none;
          color: #666;
          font-size: 1rem;
          cursor: pointer;
          padding: 0.5rem 0;
          margin-right: 1rem;
        }
        
        .photo-gallery__back-button:hover {
          color: #333;
        }
        
        .photo-gallery__button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          background-color: #ffbd00;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .photo-gallery__button:hover {
          background-color: #e6a800;
        }
        
        .photo-gallery__button--secondary {
          background-color: #f8f9fa;
          color: #6c757d;
        }
        
        .photo-gallery__button--secondary:hover {
          background-color: #e2e6ea;
        }
        
        .photo-gallery__album-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .photo-gallery__album-card {
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .photo-gallery__album-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .photo-gallery__album-cover {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        
        .photo-gallery__album-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .photo-gallery__album-private {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .photo-gallery__album-info {
          padding: 1.5rem;
        }
        
        .photo-gallery__album-info h3 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }
        
        .photo-gallery__album-info p {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #666;
          font-size: 0.9rem;
        }
        
        .photo-gallery__album-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #666;
        }
        
        .photo-gallery__album-description {
          margin-bottom: 2rem;
          color: #666;
        }
        
        .photo-gallery__photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .photo-gallery__empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .photo-gallery__empty p {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #666;
        }
        
        .photo-gallery__photo-card {
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .photo-gallery__photo-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .photo-gallery__photo-thumbnail {
          position: relative;
          height: 180px;
          overflow: hidden;
        }
        
        .photo-gallery__photo-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .photo-gallery__photo-private {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .photo-gallery__photo-info {
          padding: 1rem;
        }
        
        .photo-gallery__photo-info h3 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-size: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .photo-gallery__photo-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: #666;
        }
        
        .photo-gallery__delete-button {
          background: none;
          border: none;
          color: #dc3545;
          font-size: 0.8rem;
          cursor: pointer;
          padding: 0;
        }
        
        .photo-gallery__delete-button:hover {
          text-decoration: underline;
        }
        
        .photo-gallery__photo-view {
          margin-bottom: 2rem;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          text-align: center;
        }
        
        .photo-gallery__photo-view img {
          max-width: 100%;
          max-height: 70vh;
        }
        
        .photo-gallery__photo-details {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .photo-gallery__photo-actions {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        
        .photo-gallery__like-button {
          background: none;
          border: none;
          color: #dc3545;
          font-size: 1rem;
          cursor: pointer;
          padding: 0;
        }
        
        .photo-gallery__like-button:hover {
          color: #c82333;
        }
        
        .photo-gallery__photo-info-detail h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }
        
        .photo-gallery__photo-info-detail p {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #666;
        }
        
        .photo-gallery__photo-meta-detail {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }
        
        .photo-gallery__photo-tags {
          margin-top: 0.5rem;
        }
        
        .photo-gallery__tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .photo-gallery__tag {
          background-color: #f0f0f0;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .photo-gallery__modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .photo-gallery__modal-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .photo-gallery__modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #eee;
        }
        
        .photo-gallery__modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }
        
        .photo-gallery__modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }
        
        .photo-gallery__modal-body {
          padding: 1.5rem;
        }
        
        .photo-gallery__form-group {
          margin-bottom: 1.5rem;
        }
        
        .photo-gallery__form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .photo-gallery__form-group input[type="text"],
        .photo-gallery__form-group textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .photo-gallery__form-group textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        .photo-gallery__form-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .photo-gallery__form-checkbox input {
          width: auto;
        }
        
        .photo-gallery__form-checkbox label {
          margin-bottom: 0;
        }
        
        .photo-gallery__form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .photo-gallery__album-grid,
          .photo-gallery__photo-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
          
          .photo-gallery__header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .photo-gallery__header h2 {
            margin-bottom: 1rem;
          }
          
          .photo-gallery__photo-actions {
            flex-direction: column;
            gap: 1rem;
          }
          
          .photo-gallery__form-actions {
            flex-direction: column;
          }
          
          .photo-gallery__form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default PhotoGallery;

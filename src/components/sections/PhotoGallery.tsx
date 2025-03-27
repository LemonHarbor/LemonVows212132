import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from '@/components/ui/Button';

interface PhotoItem {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  likes: number;
  isPrivate: boolean;
}

interface PhotoAlbum {
  id: string;
  name: string;
  description?: string;
  coverPhoto?: string;
  photos: PhotoItem[];
  isPrivate: boolean;
}

const PhotoGallery: React.FC = () => {
  const { t } = useTranslation('common');
  const [albums, setAlbums] = React.useState<PhotoAlbum[]>([]);
  const [activeAlbum, setActiveAlbum] = React.useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = React.useState<'date' | 'likes' | 'title'>('date');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const [filterTag, setFilterTag] = React.useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [showAddAlbumModal, setShowAddAlbumModal] = React.useState(false);
  const [showLightbox, setShowLightbox] = React.useState(false);
  const [albumName, setAlbumName] = React.useState('');
  const [albumDescription, setAlbumDescription] = React.useState('');
  const [albumPrivate, setAlbumPrivate] = React.useState(false);
  const [uploadFiles, setUploadFiles] = React.useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Initialisiere ein Standardalbum, wenn keines vorhanden ist
  React.useEffect(() => {
    if (albums.length === 0) {
      const defaultAlbum: PhotoAlbum = {
        id: 'album-1',
        name: t('gallery.defaultAlbum'),
        description: t('gallery.defaultAlbumDescription'),
        photos: [],
        isPrivate: false
      };
      setAlbums([defaultAlbum]);
      setActiveAlbum(defaultAlbum.id);
    }
  }, [t]);

  // Aktives Album
  const getActiveAlbum = React.useMemo(() => {
    if (!activeAlbum) return null;
    return albums.find(album => album.id === activeAlbum) || null;
  }, [albums, activeAlbum]);

  // Ausgewähltes Foto
  const getSelectedPhoto = React.useMemo(() => {
    if (!selectedPhoto || !getActiveAlbum) return null;
    return getActiveAlbum.photos.find(photo => photo.id === selectedPhoto) || null;
  }, [getActiveAlbum, selectedPhoto]);

  // Gefilterte und sortierte Fotos
  const filteredAndSortedPhotos = React.useMemo(() => {
    if (!getActiveAlbum) return [];
    
    let filtered = [...getActiveAlbum.photos];
    
    // Nach Tag filtern
    if (filterTag) {
      filtered = filtered.filter(photo => photo.tags.includes(filterTag));
    }
    
    // Sortieren
    return filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'date':
          valueA = new Date(a.uploadedAt).getTime();
          valueB = new Date(b.uploadedAt).getTime();
          break;
        case 'likes':
          valueA = a.likes;
          valueB = b.likes;
          break;
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        default:
          valueA = new Date(a.uploadedAt).getTime();
          valueB = new Date(b.uploadedAt).getTime();
      }
      
      if (sortDirection === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  }, [getActiveAlbum, filterTag, sortBy, sortDirection]);

  // Alle Tags aus dem aktiven Album
  const allTags = React.useMemo(() => {
    if (!getActiveAlbum) return [];
    
    const tags = new Set<string>();
    getActiveAlbum.photos.forEach(photo => {
      photo.tags.forEach(tag => tags.add(tag));
    });
    
    return Array.from(tags).sort();
  }, [getActiveAlbum]);

  // Album hinzufügen
  const addAlbum = () => {
    if (!albumName.trim()) {
      alert(t('gallery.pleaseEnterAlbumName'));
      return;
    }
    
    const newAlbum: PhotoAlbum = {
      id: `album-${Date.now()}`,
      name: albumName,
      description: albumDescription,
      photos: [],
      isPrivate: albumPrivate
    };
    
    setAlbums([...albums, newAlbum]);
    setActiveAlbum(newAlbum.id);
    setShowAddAlbumModal(false);
    
    // Zurücksetzen der Eingabefelder
    setAlbumName('');
    setAlbumDescription('');
    setAlbumPrivate(false);
  };

  // Album löschen
  const deleteAlbum = (albumId: string) => {
    if (albums.length <= 1) {
      alert(t('gallery.cannotDeleteLastAlbum'));
      return;
    }
    
    if (window.confirm(t('gallery.confirmDeleteAlbum'))) {
      const newAlbums = albums.filter(album => album.id !== albumId);
      setAlbums(newAlbums);
      
      if (activeAlbum === albumId) {
        setActiveAlbum(newAlbums[0].id);
      }
    }
  };

  // Foto hochladen
  const uploadPhotos = () => {
    if (!uploadFiles || uploadFiles.length === 0 || !getActiveAlbum) {
      alert(t('gallery.pleaseSelectFiles'));
      return;
    }
    
    // Simuliere Upload-Fortschritt
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Füge Fotos zum aktiven Album hinzu
        const newPhotos: PhotoItem[] = Array.from(uploadFiles).map((file, index) => ({
          id: `photo-${Date.now()}-${index}`,
          url: URL.createObjectURL(file),
          thumbnail: URL.createObjectURL(file),
          title: file.name,
          uploadedBy: 'Aktueller Benutzer',
          uploadedAt: new Date().toISOString(),
          tags: [],
          likes: 0,
          isPrivate: false
        }));
        
        setAlbums(prevAlbums => 
          prevAlbums.map(album => 
            album.id === activeAlbum
              ? { ...album, photos: [...album.photos, ...newPhotos] }
              : album
          )
        );
        
        setShowUploadModal(false);
        setUploadFiles(null);
        setUploadProgress(0);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }, 300);
  };

  // Foto löschen
  const deletePhoto = (photoId: string) => {
    if (!getActiveAlbum) return;
    
    if (window.confirm(t('gallery.confirmDeletePhoto'))) {
      setAlbums(prevAlbums => 
        prevAlbums.map(album => 
          album.id === activeAlbum
            ? { 
                ...album, 
                photos: album.photos.filter(photo => photo.id !== photoId) 
              }
            : album
        )
      );
      
      if (selectedPhoto === photoId) {
        setSelectedPhoto(null);
      }
    }
  };

  // Foto auswählen
  const selectPhoto = (photoId: string) => {
    setSelectedPhoto(photoId);
  };

  // Foto in Lightbox anzeigen
  const openLightbox = (photoId: string) => {
    selectPhoto(photoId);
    setShowLightbox(true);
  };

  // Nächstes Foto in Lightbox
  const nextPhoto = () => {
    if (!getActiveAlbum || !selectedPhoto) return;
    
    const currentIndex = filteredAndSortedPhotos.findIndex(photo => photo.id === selectedPhoto);
    if (currentIndex < filteredAndSortedPhotos.length - 1) {
      setSelectedPhoto(filteredAndSortedPhotos[currentIndex + 1].id);
    }
  };

  // Vorheriges Foto in Lightbox
  const prevPhoto = () => {
    if (!getActiveAlbum || !selectedPhoto) return;
    
    const currentIndex = filteredAndSortedPhotos.findIndex(photo => photo.id === selectedPhoto);
    if (currentIndex > 0) {
      setSelectedPhoto(filteredAndSortedPhotos[currentIndex - 1].id);
    }
  };

  // Foto liken
  const likePhoto = (photoId: string) => {
    if (!getActiveAlbum) return;
    
    setAlbums(prevAlbums => 
      prevAlbums.map(album => 
        album.id === activeAlbum
          ? { 
              ...album, 
              photos: album.photos.map(photo => 
                photo.id === photoId
                  ? { ...photo, likes: photo.likes + 1 }
                  : photo
              ) 
            }
          : album
      )
    );
  };

  // Tag zu Foto hinzufügen
  const addTagToPhoto = (photoId: string, tag: string) => {
    if (!getActiveAlbum || !tag.trim()) return;
    
    setAlbums(prevAlbums => 
      prevAlbums.map(album => 
        album.id === activeAlbum
          ? { 
              ...album, 
              photos: album.photos.map(photo => 
                photo.id === photoId && !photo.tags.includes(tag)
                  ? { ...photo, tags: [...photo.tags, tag] }
                  : photo
              ) 
            }
          : album
      )
    );
  };

  // Tag von Foto entfernen
  const removeTagFromPhoto = (photoId: string, tag: string) => {
    if (!getActiveAlbum) return;
    
    setAlbums(prevAlbums => 
      prevAlbums.map(album => 
        album.id === activeAlbum
          ? { 
              ...album, 
              photos: album.photos.map(photo => 
                photo.id === photoId
                  ? { ...photo, tags: photo.tags.filter(t => t !== tag) }
                  : photo
              ) 
            }
          : album
      )
    );
  };

  // Foto-Privatsphäre umschalten
  const togglePhotoPrivacy = (photoId: string) => {
    if (!getActiveAlbum) return;
    
    setAlbums(prevAlbums => 
      prevAlbums.map(album => 
        album.id === activeAlbum
          ? { 
              ...album, 
              photos: album.photos.map(photo => 
                photo.id === photoId
                  ? { ...photo, isPrivate: !photo.isPrivate }
                  : photo
              ) 
            }
          : album
      )
    );
  };

  // Album-Privatsphäre umschalten
  const toggleAlbumPrivacy = (albumId: string) => {
    setAlbums(prevAlbums => 
      prevAlbums.map(album => 
        album.id === albumId
          ? { ...album, isPrivate: !album.isPrivate }
          : album
      )
    );
  };

  // Formatiere Datum
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  return (
    <div className="photo-gallery">
      <div className="photo-gallery__header">
        <h1>{t('gallery.title')}</h1>
        <p>{t('gallery.description')}</p>
        
        <div className="photo-gallery__controls">
          <div className="photo-gallery__albums">
            <select 
              value={activeAlbum || ''}
              onChange={(e) => setActiveAlbum(e.target.value)}
              className="select"
            >
              {albums.map(album => (
                <option key={album.id} value={album.id}>
                  {album.name} {album.isPrivate ? `(${t('gallery.private')})` : ''}
                </option>
              ))}
            </select>
            
            <Button 
              variant="secondary"
              onClick={() => setShowAddAlbumModal(true)}
            >
              {t('gallery.newAlbum')}
            </Button>
            
            {albums.length > 1 && activeAlbum && (
              <Button 
                variant="destructive"
                onClick={() => deleteAlbum(activeAlbum)}
              >
                {t('gallery.deleteAlbum')}
              </Button>
            )}
            
            {activeAlbum && (
              <Button 
                variant="secondary"
                onClick={() => activeAlbum && toggleAlbumPrivacy(activeAlbum)}
              >
                {getActiveAlbum?.isPrivate ? t('gallery.makePublic') : t('gallery.makePrivate')}
              </Button>
            )}
          </div>
          
          <div className="photo-gallery__actions">
            <Button onClick={() => setShowUploadModal(true)}>
              {t('gallery.uploadPhotos')}
            </Button>
            
            <div className="photo-gallery__view-options">
              <button 
                className={`view-option ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <span role="img" aria-label="Grid View">📱</span>
              </button>
              
              <button 
                className={`view-option ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <span role="img" aria-label="List View">📋</span>
              </button>
            </div>
            
            <div className="photo-gallery__sort-options">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'likes' | 'title')}
                className="select"
              >
                <option value="date">{t('gallery.sortByDate')}</option>
                <option value="likes">{t('gallery.sortByLikes')}</option>
                <option value="title">{t('gallery.sortByTitle')}</option>
              </select>
              
              <button 
                className="sort-direction"
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                <span role="img" aria-label="Sort Direction">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {getActiveAlbum && (
        <div className="photo-gallery__content">
          <div className="photo-gallery__filters">
            <div className="photo-gallery__tags">
              <h3>{t('gallery.filterByTag')}</h3>
              
              <div className="tag-list">
                <button 
                  className={`tag ${filterTag === null ? 'active' : ''}`}
                  onClick={() => setFilterTag(null)}
                >
                  {t('gallery.allPhotos')}
                </button>
                
                {allTags.map(tag => (
                  <button 
                    key={tag}
                    className={`tag ${filterTag === tag ? 'active' : ''}`}
                    onClick={() => setFilterTag(tag === filterTag ? null : tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {filteredAndSortedPhotos.length > 0 ? (
            <div className={`photo-gallery__photos photo-gallery__photos--${viewMode}`}>
              {viewMode === 'grid' ? (
                <div className="photo-gallery__grid">
                  {filteredAndSortedPhotos.map(photo => (
                    <div 
                      key={photo.id}
                      className={`photo-gallery__photo-item ${photo.isPrivate ? 'private' : ''}`}
                      onClick={() => openLightbox(photo.id)}
                    >
                      <div className="photo-gallery__photo-wrapper">
                        <img 
                          src={photo.thumbnail} 
                          alt={photo.title} 
                          className="photo-gallery__thumbnail"
                        />
                        
                        {photo.isPrivate && (
                          <div className="photo-gallery__private-badge">
                            <span role="img" aria-label="Private">🔒</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="photo-gallery__photo-info">
                        <div className="photo-gallery__photo-title">{photo.title}</div>
                        <div className="photo-gallery__photo-meta">
                          <span className="photo-gallery__photo-date">
                            {formatDate(photo.uploadedAt)}
                          </span>
                          <span className="photo-gallery__photo-likes">
                            <span role="img" aria-label="Likes">❤️</span> {photo.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="photo-gallery__list">
                  <table className="photo-gallery__table">
                    <thead>
                      <tr>
                        <th>{t('gallery.thumbnail')}</th>
                        <th>{t('gallery.title')}</th>
                        <th>{t('gallery.uploadedBy')}</th>
                        <th>{t('gallery.uploadedAt')}</th>
                        <th>{t('gallery.tags')}</th>
                        <th>{t('gallery.likes')}</th>
                        <th>{t('gallery.privacy')}</th>
                        <th>{t('gallery.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedPhotos.map(photo => (
                        <tr 
                          key={photo.id}
                          className={photo.isPrivate ? 'private' : ''}
                        >
                          <td>
                            <div 
                              className="photo-gallery__thumbnail-container"
                              onClick={() => openLightbox(photo.id)}
                            >
                              <img 
                                src={photo.thumbnail} 
                                alt={photo.title} 
                                className="photo-gallery__thumbnail-small"
                              />
                            </div>
                          </td>
                          <td>{photo.title}</td>
                          <td>{photo.uploadedBy}</td>
                          <td>{formatDate(photo.uploadedAt)}</td>
                          <td>
                            <div className="photo-gallery__tags-list">
                              {photo.tags.map(tag => (
                                <span key={tag} className="tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <button 
                              className="like-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                likePhoto(photo.id);
                              }}
                            >
                              <span role="img" aria-label="Like">❤️</span> {photo.likes}
                            </button>
                          </td>
                          <td>
                            <button 
                              className="privacy-toggle"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePhotoPrivacy(photo.id);
                              }}
                            >
                              {photo.isPrivate ? (
                                <span role="img" aria-label="Private">🔒</span>
                              ) : (
                                <span role="img" aria-label="Public">🔓</span>
                              )}
                            </button>
                          </td>
                          <td>
                            <div className="photo-actions">
                              <button 
                                className="btn-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openLightbox(photo.id);
                                }}
                              >
                                <span role="img" aria-label="View">👁️</span>
                              </button>
                              
                              <button 
                                className="btn-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deletePhoto(photo.id);
                                }}
                              >
                                <span role="img" aria-label="Delete">🗑️</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="photo-gallery__empty">
              <p>{t('gallery.noPhotosFound')}</p>
              <Button onClick={() => setShowUploadModal(true)}>
                {t('gallery.uploadPhotos')}
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Modals */}
      {showUploadModal && (
        <div className="photo-gallery__modal">
          <div className="photo-gallery__modal-content">
            <h3>{t('gallery.uploadPhotos')}</h3>
            
            <div className="photo-gallery__modal-form">
              <div className="photo-gallery__form-group">
                <label>{t('gallery.selectFiles')}</label>
                <input 
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  onChange={(e) => setUploadFiles(e.target.files)}
                  className="file-input"
                />
              </div>
              
              {uploadProgress > 0 && (
                <div className="photo-gallery__upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">{uploadProgress}%</div>
                </div>
              )}
            </div>
            
            <div className="photo-gallery__modal-actions">
              <Button 
                onClick={uploadPhotos}
                disabled={!uploadFiles || uploadFiles.length === 0}
              >
                {t('gallery.upload')}
              </Button>
              
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFiles(null);
                  setUploadProgress(0);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                {t('gallery.cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {showAddAlbumModal && (
        <div className="photo-gallery__modal">
          <div className="photo-gallery__modal-content">
            <h3>{t('gallery.newAlbum')}</h3>
            
            <div className="photo-gallery__modal-form">
              <div className="photo-gallery__form-group">
                <label>{t('gallery.albumName')}</label>
                <input 
                  type="text"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                  placeholder={t('gallery.enterAlbumName')}
                  className="input"
                />
              </div>
              
              <div className="photo-gallery__form-group">
                <label>{t('gallery.albumDescription')}</label>
                <textarea 
                  value={albumDescription}
                  onChange={(e) => setAlbumDescription(e.target.value)}
                  placeholder={t('gallery.enterAlbumDescription')}
                  className="textarea"
                ></textarea>
              </div>
              
              <div className="photo-gallery__form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={albumPrivate}
                    onChange={(e) => setAlbumPrivate(e.target.checked)}
                  />
                  {t('gallery.privateAlbum')}
                </label>
              </div>
            </div>
            
            <div className="photo-gallery__modal-actions">
              <Button onClick={addAlbum}>
                {t('gallery.create')}
              </Button>
              
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowAddAlbumModal(false);
                  setAlbumName('');
                  setAlbumDescription('');
                  setAlbumPrivate(false);
                }}
              >
                {t('gallery.cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Lightbox */}
      {showLightbox && getSelectedPhoto && (
        <div 
          className="photo-gallery__lightbox"
          onClick={() => setShowLightbox(false)}
        >
          <div 
            className="photo-gallery__lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="photo-gallery__lightbox-close"
              onClick={() => setShowLightbox(false)}
            >
              <span role="img" aria-label="Close">✖️</span>
            </button>
            
            <div className="photo-gallery__lightbox-nav">
              <button 
                className="photo-gallery__lightbox-prev"
                onClick={prevPhoto}
              >
                <span role="img" aria-label="Previous">◀️</span>
              </button>
              
              <div className="photo-gallery__lightbox-image-container">
                <img 
                  src={getSelectedPhoto.url} 
                  alt={getSelectedPhoto.title} 
                  className="photo-gallery__lightbox-image"
                />
              </div>
              
              <button 
                className="photo-gallery__lightbox-next"
                onClick={nextPhoto}
              >
                <span role="img" aria-label="Next">▶️</span>
              </button>
            </div>
            
            <div className="photo-gallery__lightbox-details">
              <h3>{getSelectedPhoto.title}</h3>
              
              {getSelectedPhoto.description && (
                <p>{getSelectedPhoto.description}</p>
              )}
              
              <div className="photo-gallery__lightbox-meta">
                <div className="photo-gallery__lightbox-uploader">
                  {t('gallery.uploadedBy')}: {getSelectedPhoto.uploadedBy}
                </div>
                
                <div className="photo-gallery__lightbox-date">
                  {formatDate(getSelectedPhoto.uploadedAt)}
                </div>
                
                <button 
                  className="like-button"
                  onClick={() => likePhoto(getSelectedPhoto.id)}
                >
                  <span role="img" aria-label="Like">❤️</span> {getSelectedPhoto.likes}
                </button>
                
                <button 
                  className="privacy-toggle"
                  onClick={() => togglePhotoPrivacy(getSelectedPhoto.id)}
                >
                  {getSelectedPhoto.isPrivate ? (
                    <span role="img" aria-label="Private">🔒</span>
                  ) : (
                    <span role="img" aria-label="Public">🔓</span>
                  )}
                </button>
              </div>
              
              <div className="photo-gallery__lightbox-tags">
                <h4>{t('gallery.tags')}</h4>
                
                <div className="tag-list">
                  {getSelectedPhoto.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                      <button 
                        className="tag-remove"
                        onClick={() => removeTagFromPhoto(getSelectedPhoto.id, tag)}
                      >
                        <span role="img" aria-label="Remove Tag">✖️</span>
                      </button>
                    </span>
                  ))}
                  
                  <form 
                    className="add-tag-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = e.currentTarget.elements.namedItem('tag') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        addTagToPhoto(getSelectedPhoto.id, input.value.trim());
                        input.value = '';
                      }
                    }}
                  >
                    <input 
                      type="text"
                      name="tag"
                      placeholder={t('gallery.addTag')}
                      className="tag-input"
                    />
                    <button type="submit" className="tag-add">
                      <span role="img" aria-label="Add Tag">➕</span>
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="photo-gallery__lightbox-actions">
                <Button 
                  variant="secondary"
                  onClick={() => {
                    // Hier könnte man das Foto herunterladen
                    const link = document.createElement('a');
                    link.href = getSelectedPhoto.url;
                    link.download = getSelectedPhoto.title;
                    link.click();
                  }}
                >
                  {t('gallery.download')}
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={() => {
                    deletePhoto(getSelectedPhoto.id);
                    setShowLightbox(false);
                  }}
                >
                  {t('gallery.delete')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;

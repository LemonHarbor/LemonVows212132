import { render, screen, fireEvent } from '@testing-library/react';
import PhotoGallery from '@/components/sections/PhotoGallery';

describe('PhotoGallery', () => {
  const mockAlbums = [
    { 
      id: '1', 
      name: 'Verlobungsfotos', 
      description: 'Unsere Verlobungsfotos im Park',
      isPrivate: false,
      coverImage: '/images/engagement.jpg',
      photos: [
        { id: '1-1', src: '/images/engagement1.jpg', title: 'Im Park', description: 'Unser erster Kuss als Verlobte', tags: ['Verlobung', 'Park'], likes: 5 },
        { id: '1-2', src: '/images/engagement2.jpg', title: 'Der Ring', description: 'Nahaufnahme des Rings', tags: ['Verlobung', 'Ring'], likes: 8 },
      ]
    },
    { 
      id: '2', 
      name: 'Standesamt', 
      description: 'Fotos von der standesamtlichen Trauung',
      isPrivate: true,
      coverImage: '/images/civil.jpg',
      photos: [
        { id: '2-1', src: '/images/civil1.jpg', title: 'Unterschrift', description: 'Die Unterschrift im Standesamt', tags: ['Standesamt'], likes: 3 },
      ]
    },
  ];

  test('renders photo albums', () => {
    render(
      <PhotoGallery 
        albums={mockAlbums} 
        onAlbumAdd={jest.fn()} 
        onAlbumEdit={jest.fn()} 
        onAlbumDelete={jest.fn()} 
        onPhotoUpload={jest.fn()}
        onPhotoEdit={jest.fn()}
        onPhotoDelete={jest.fn()}
        onPhotoLike={jest.fn()}
      />
    );
    
    expect(screen.getByText('Verlobungsfotos')).toBeInTheDocument();
    expect(screen.getByText('Standesamt')).toBeInTheDocument();
  });

  test('displays album privacy status', () => {
    render(
      <PhotoGallery 
        albums={mockAlbums} 
        onAlbumAdd={jest.fn()} 
        onAlbumEdit={jest.fn()} 
        onAlbumDelete={jest.fn()} 
        onPhotoUpload={jest.fn()}
        onPhotoEdit={jest.fn()}
        onPhotoDelete={jest.fn()}
        onPhotoLike={jest.fn()}
      />
    );
    
    expect(screen.getByText('Öffentlich')).toBeInTheDocument(); // For Verlobungsfotos
    expect(screen.getByText('Privat')).toBeInTheDocument(); // For Standesamt
  });

  test('allows adding a new album', () => {
    const mockOnAlbumAdd = jest.fn();
    
    render(
      <PhotoGallery 
        albums={mockAlbums} 
        onAlbumAdd={mockOnAlbumAdd} 
        onAlbumEdit={jest.fn()} 
        onAlbumDelete={jest.fn()} 
        onPhotoUpload={jest.fn()}
        onPhotoEdit={jest.fn()}
        onPhotoDelete={jest.fn()}
        onPhotoLike={jest.fn()}
      />
    );
    
    const addButton = screen.getByText('Album hinzufügen');
    fireEvent.click(addButton);
    
    expect(mockOnAlbumAdd).toHaveBeenCalled();
  });

  test('displays photos when an album is selected', () => {
    render(
      <PhotoGallery 
        albums={mockAlbums} 
        onAlbumAdd={jest.fn()} 
        onAlbumEdit={jest.fn()} 
        onAlbumDelete={jest.fn()} 
        onPhotoUpload={jest.fn()}
        onPhotoEdit={jest.fn()}
        onPhotoDelete={jest.fn()}
        onPhotoLike={jest.fn()}
      />
    );
    
    // Click on an album to view photos
    const albumCard = screen.getByText('Verlobungsfotos').closest('.album-card');
    fireEvent.click(albumCard);
    
    // Check if photos are displayed
    expect(screen.getByText('Im Park')).toBeInTheDocument();
    expect(screen.getByText('Der Ring')).toBeInTheDocument();
  });

  test('allows uploading photos to an album', () => {
    const mockOnPhotoUpload = jest.fn();
    
    render(
      <PhotoGallery 
        albums={mockAlbums} 
        onAlbumAdd={jest.fn()} 
        onAlbumEdit={jest.fn()} 
        onAlbumDelete={jest.fn()} 
        onPhotoUpload={mockOnPhotoUpload}
        onPhotoEdit={jest.fn()}
        onPhotoDelete={jest.fn()}
        onPhotoLike={jest.fn()}
      />
    );
    
    // Click on an album to view photos
    const albumCard = screen.getByText('Verlobungsfotos').closest('.album-card');
    fireEvent.click(albumCard);
    
    // Click on upload button
    const uploadButton = screen.getByText('Fotos hochladen');
    fireEvent.click(uploadButton);
    
    expect(mockOnPhotoUpload).toHaveBeenCalledWith('1'); // Called with album ID
  });

  test('allows liking a photo', () => {
    const mockOnPhotoLike = jest.fn();
    
    render(
      <PhotoGallery 
        albums={mockAlbums} 
        onAlbumAdd={jest.fn()} 
        onAlbumEdit={jest.fn()} 
        onAlbumDelete={jest.fn()} 
        onPhotoUpload={jest.fn()}
        onPhotoEdit={jest.fn()}
        onPhotoDelete={jest.fn()}
        onPhotoLike={mockOnPhotoLike}
      />
    );
    
    // Click on an album to view photos
    const albumCard = screen.getByText('Verlobungsfotos').closest('.album-card');
    fireEvent.click(albumCard);
    
    // Click on like button for a photo
    const likeButtons = screen.getAllByText('❤️');
    fireEvent.click(likeButtons[0]);
    
    expect(mockOnPhotoLike).toHaveBeenCalledWith('1-1'); // Called with photo ID
  });
});

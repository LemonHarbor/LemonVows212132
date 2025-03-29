import { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@services/supabase';

export interface MusicRequest {
  id: string;
  title: string;
  artist: string;
  addedBy: string;
  upvotes: number;
  downvotes: number;
}

interface MusicContextType {
  musicRequests: MusicRequest[];
  loading: boolean;
  error: string | null;
  addMusicRequest: (request: Omit<MusicRequest, 'id' | 'upvotes' | 'downvotes'>) => Promise<void>;
  deleteMusicRequest: (id: string) => Promise<void>;
  upvoteRequest: (id: string) => Promise<void>;
  downvoteRequest: (id: string) => Promise<void>;
  getPlaylist: () => MusicRequest[];
  exportPlaylist: () => string;
}

export const MusicContext = createContext<MusicContextType>({
  musicRequests: [],
  loading: true,
  error: null,
  addMusicRequest: async () => {},
  deleteMusicRequest: async () => {},
  upvoteRequest: async () => {},
  downvoteRequest: async () => {},
  getPlaylist: () => [],
  exportPlaylist: () => '',
});

interface MusicProviderProps {
  children: ReactNode;
  weddingId: string;
}

export const MusicProvider = ({ children, weddingId }: MusicProviderProps) => {
  const [musicRequests, setMusicRequests] = useState<MusicRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('music_requests')
          .select('*')
          .eq('wedding_id', weddingId);
          
        if (error) throw error;
        
        setMusicRequests(data.map(item => ({
          id: item.id,
          title: item.title,
          artist: item.artist,
          addedBy: item.added_by,
          upvotes: item.upvotes,
          downvotes: item.downvotes
        })));
      } catch (err) {
        console.error('Error fetching music requests:', err);
        setError('Failed to load music requests');
      } finally {
        setLoading(false);
      }
    };
    
    if (weddingId) {
      fetchData();
    }
  }, [weddingId]);

  const addMusicRequest = async (request: Omit<MusicRequest, 'id' | 'upvotes' | 'downvotes'>) => {
    try {
      const { data, error } = await supabase
        .from('music_requests')
        .insert([{
          wedding_id: weddingId,
          title: request.title,
          artist: request.artist,
          added_by: request.addedBy,
          upvotes: 0,
          downvotes: 0
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      setMusicRequests(prev => [...prev, {
        id: data.id,
        title: data.title,
        artist: data.artist,
        addedBy: data.added_by,
        upvotes: data.upvotes,
        downvotes: data.downvotes
      }]);
    } catch (err) {
      console.error('Error adding music request:', err);
      setError('Failed to add music request');
    }
  };

  const deleteMusicRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('music_requests')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setMusicRequests(prev => prev.filter(request => request.id !== id));
    } catch (err) {
      console.error('Error deleting music request:', err);
      setError('Failed to delete music request');
    }
  };

  const upvoteRequest = async (id: string) => {
    try {
      const request = musicRequests.find(r => r.id === id);
      if (!request) return;
      
      const { error } = await supabase
        .from('music_requests')
        .update({ upvotes: request.upvotes + 1 })
        .eq('id', id);
        
      if (error) throw error;
      
      setMusicRequests(prev => prev.map(r => 
        r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r
      ));
    } catch (err) {
      console.error('Error upvoting music request:', err);
      setError('Failed to upvote music request');
    }
  };

  const downvoteRequest = async (id: string) => {
    try {
      const request = musicRequests.find(r => r.id === id);
      if (!request) return;
      
      const { error } = await supabase
        .from('music_requests')
        .update({ downvotes: request.downvotes + 1 })
        .eq('id', id);
        
      if (error) throw error;
      
      setMusicRequests(prev => prev.map(r => 
        r.id === id ? { ...r, downvotes: r.downvotes + 1 } : r
      ));
    } catch (err) {
      console.error('Error downvoting music request:', err);
      setError('Failed to downvote music request');
    }
  };

  const getPlaylist = () => {
    // Sort by net votes (upvotes - downvotes)
    return [...musicRequests].sort((a, b) => 
      (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
    );
  };

  const exportPlaylist = () => {
    const playlist = getPlaylist();
    let csv = 'Title,Artist,Votes\n';
    
    playlist.forEach(song => {
      const netVotes = song.upvotes - song.downvotes;
      csv += `"${song.title}","${song.artist}",${netVotes}\n`;
    });
    
    return csv;
  };

  return (
    <MusicContext.Provider
      value={{
        musicRequests,
        loading,
        error,
        addMusicRequest,
        deleteMusicRequest,
        upvoteRequest,
        downvoteRequest,
        getPlaylist,
        exportPlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

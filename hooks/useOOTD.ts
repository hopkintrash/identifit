import { useState, useCallback } from 'react';
import { OOTD } from '@/types/ootd';
import { mockUserOOTDs, mockFriendsOOTDs, currentUser } from '@/data/ootd';

export function useOOTD() {
  const [userOOTDs, setUserOOTDs] = useState<OOTD[]>(mockUserOOTDs);
  const [friendsOOTDs, setFriendsOOTDs] = useState<OOTD[]>(mockFriendsOOTDs);

  const saveOOTD = useCallback((
    imageUri: string,
    options: {
      occasion?: string;
      weather?: string;
      tags?: string[];
      isPrivate?: boolean;
      date?: string;
    } = {}
  ): OOTD => {
    const today = new Date();
    const dateString = options.date || today.toISOString().split('T')[0];

    const newOOTD: OOTD = {
      id: `ootd-${Date.now()}`,
      userId: currentUser.id,
      imageUri,
      cutoutImageUri: imageUri, // In a real app, this would be processed
      date: dateString,
      createdAt: today.toISOString(),
      occasion: options.occasion,
      weather: options.weather,
      tags: options.tags,
      isPrivate: options.isPrivate || false,
      likes: 0,
      isLiked: false,
    };

    // Add to user's personal collection
    setUserOOTDs(prev => [newOOTD, ...prev]);

    // If not private, add to friends feed
    if (!newOOTD.isPrivate) {
      setFriendsOOTDs(prev => [newOOTD, ...prev]);
    }

    return newOOTD;
  }, []);

  const toggleOOTDLike = useCallback((ootdId: string) => {
    // Update in user's collection
    setUserOOTDs(prev => prev.map(ootd => 
      ootd.id === ootdId 
        ? { 
            ...ootd, 
            isLiked: !ootd.isLiked,
            likes: ootd.isLiked ? ootd.likes - 1 : ootd.likes + 1
          }
        : ootd
    ));

    // Update in friends feed
    setFriendsOOTDs(prev => prev.map(ootd => 
      ootd.id === ootdId 
        ? { 
            ...ootd, 
            isLiked: !ootd.isLiked,
            likes: ootd.isLiked ? ootd.likes - 1 : ootd.likes + 1
          }
        : ootd
    ));
  }, []);

  const deleteOOTD = useCallback((ootdId: string) => {
    // Remove from user's collection
    setUserOOTDs(prev => prev.filter(ootd => ootd.id !== ootdId));

    // Remove from friends feed if it exists there
    setFriendsOOTDs(prev => prev.filter(ootd => ootd.id !== ootdId));
  }, []);

  const getOOTDForDate = useCallback((date: string): OOTD | undefined => {
    return userOOTDs.find(ootd => ootd.date === date);
  }, [userOOTDs]);

  const getRecentOOTDs = useCallback((limit: number = 5): OOTD[] => {
    return userOOTDs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [userOOTDs]);

  const getAllFriendsOOTDs = useCallback((): OOTD[] => {
    return [...friendsOOTDs, ...userOOTDs.filter(ootd => !ootd.isPrivate)]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [friendsOOTDs, userOOTDs]);

  const getTopStyles = useCallback((limit: number = 3): string[] => {
    const tagCounts: Record<string, number> = {};

    userOOTDs.forEach(ootd => {
      if (ootd.tags) {
        ootd.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag);
  }, [userOOTDs]);

  return {
    userOOTDs,
    friendsOOTDs,
    saveOOTD,
    toggleOOTDLike,
    deleteOOTD,
    getOOTDForDate,
    getRecentOOTDs,
    getAllFriendsOOTDs,
    getTopStyles,
  };
}
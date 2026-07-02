/* MARKER-MAKE-KIT-INVOKED */
/* MARKER-MAKE-KIT-DISCOVERY-READ */
import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AuthPage } from './components/AuthPage';
import { HomePage } from './components/HomePage';
import { CreatePostModal } from './components/CreatePostModal';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarColor: [string, string];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  gradient: [string, string];
  genre: string;
  vibe: string;
  duration: string;
}

export interface Post {
  id: string;
  user: User;
  imageUrl: string;
  caption: string;
  likes: number;
  liked: boolean;
  timestamp: Date;
  songs: Song[];
  selectedSongId: string | null;
}

const ALL_SONGS: Song[] = [
  { id: 's1', title: 'Blinding Lights', artist: 'The Weeknd', gradient: ['#7c3aed', '#c026d3'], genre: 'Synth-Pop', vibe: 'Late Night Drive', duration: '3:20' },
  { id: 's2', title: 'As It Was', artist: 'Harry Styles', gradient: ['#0284c7', '#7c3aed'], genre: 'Indie Pop', vibe: 'Golden Hour', duration: '2:37' },
  { id: 's3', title: 'Levitating', artist: 'Dua Lipa', gradient: ['#db2777', '#9333ea'], genre: 'Disco Pop', vibe: 'Main Character', duration: '3:23' },
  { id: 's4', title: 'Heat Waves', artist: 'Glass Animals', gradient: ['#16a34a', '#0284c7'], genre: 'Indie', vibe: 'Daydream', duration: '3:58' },
  { id: 's5', title: 'Golden Hour', artist: 'JVKE', gradient: ['#d97706', '#dc2626'], genre: 'Indie Pop', vibe: 'Falling in Love', duration: '3:29' },
  { id: 's6', title: 'Glimpse of Us', artist: 'Joji', gradient: ['#475569', '#1e3a5f'], genre: 'Alt-R&B', vibe: 'Bittersweet', duration: '3:39' },
  { id: 's7', title: 'good 4 u', artist: 'Olivia Rodrigo', gradient: ['#dc2626', '#9333ea'], genre: 'Pop Punk', vibe: 'Core Memory', duration: '2:58' },
  { id: 's8', title: 'Running Up That Hill', artist: 'Kate Bush', gradient: ['#6d28d9', '#1e3a5f'], genre: 'Art Pop', vibe: 'Ethereal', duration: '5:02' },
  { id: 's9', title: 'Anti-Hero', artist: 'Taylor Swift', gradient: ['#1e3a5f', '#4f46e5'], genre: 'Synth-Pop', vibe: 'Midnight Spiral', duration: '3:20' },
  { id: 's10', title: 'Stay', artist: 'The Kid LAROI', gradient: ['#f59e0b', '#dc2626'], genre: 'Pop', vibe: 'Summer Night', duration: '2:22' },
  { id: 's11', title: 'Nights', artist: 'Frank Ocean', gradient: ['#0f766e', '#4f46e5'], genre: 'R&B', vibe: 'City Lights', duration: '5:07' },
  { id: 's12', title: 'Redbone', artist: 'Childish Gambino', gradient: ['#92400e', '#7c3aed'], genre: 'Funk-Soul', vibe: 'Slow Burn', duration: '5:26' },
  { id: 's13', title: 'Cruel Summer', artist: 'Taylor Swift', gradient: ['#dc2626', '#f59e0b'], genre: 'Synth-Pop', vibe: 'Butterflies', duration: '2:58' },
  { id: 's14', title: 'Location', artist: 'Khalid', gradient: ['#0284c7', '#16a34a'], genre: 'R&B', vibe: 'Laid Back', duration: '3:37' },
  { id: 's15', title: 'Peaches', artist: 'Justin Bieber', gradient: ['#f59e0b', '#16a34a'], genre: 'R&B-Pop', vibe: 'Good Vibes', duration: '3:18' },
];

function pickSongs(count = 6): Song[] {
  return [...ALL_SONGS].sort(() => Math.random() - 0.5).slice(0, count);
}

const SAMPLE_USER_MAYA: User = {
  id: 'u1',
  username: 'maya.vibes',
  displayName: 'Maya',
  avatarColor: ['#7c3aed', '#c026d3'],
};

const SAMPLE_USER_ALEX: User = {
  id: 'u2',
  username: 'alex.captures',
  displayName: 'Alex',
  avatarColor: ['#0284c7', '#7c3aed'],
};

const SAMPLE_USER_SOFIA: User = {
  id: 'u3',
  username: 'sofia.moments',
  displayName: 'Sofia',
  avatarColor: ['#db2777', '#9333ea'],
};

const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    user: SAMPLE_USER_MAYA,
    imageUrl: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=600&h=600&fit=crop&auto=format',
    caption: 'nights like this make everything feel cinematic ✨',
    likes: 284,
    liked: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 47),
    songs: pickSongs(),
    selectedSongId: null,
  },
  {
    id: 'p2',
    user: SAMPLE_USER_ALEX,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=600&fit=crop&auto=format',
    caption: 'front row energy forever 🎶🔥 nothing compares to being in the crowd',
    likes: 1043,
    liked: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    songs: pickSongs(),
    selectedSongId: null,
  },
  {
    id: 'p3',
    user: SAMPLE_USER_SOFIA,
    imageUrl: 'https://images.unsplash.com/photo-1679212839469-fb16a48919ce?w=600&h=600&fit=crop&auto=format',
    caption: 'city never sleeps and neither do i apparently 🌃',
    likes: 512,
    liked: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    songs: pickSongs(),
    selectedSongId: null,
  },
  {
    id: 'p4',
    user: SAMPLE_USER_MAYA,
    imageUrl: 'https://images.unsplash.com/photo-1488036106564-87ecb155bb15?w=600&h=600&fit=crop&auto=format',
    caption: 'the bass dropped and time stopped 🫀 incredible night',
    likes: 739,
    liked: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
    songs: pickSongs(),
    selectedSongId: null,
  },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [showCreate, setShowCreate] = useState(false);

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleSelectSong = (postId: string, songId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, selectedSongId: p.selectedSongId === songId ? null : songId }
          : p
      )
    );
  };

  const handleCreate = (imageUrl: string, caption: string, songs: Song[]) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      user: currentUser,
      imageUrl,
      caption,
      likes: 0,
      liked: false,
      timestamp: new Date(),
      songs,
      selectedSongId: null,
    };
    setPosts((prev) => [newPost, ...prev]);
    setShowCreate(false);
  };

  if (!currentUser) {
    return <AuthPage onAuth={setCurrentUser} />;
  }

  return (
    <>
      <HomePage
        currentUser={currentUser}
        posts={posts}
        onSignOut={() => setCurrentUser(null)}
        onNewPost={() => setShowCreate(true)}
        onToggleLike={handleToggleLike}
        onSelectSong={handleSelectSong}
      />
      <AnimatePresence>
        {showCreate && (
          <CreatePostModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
        )}
      </AnimatePresence>
    </>
  );
}

import { Music2, Plus, LogOut } from 'lucide-react';
import { PostCard } from './PostCard';
import type { User, Post } from '../App';

interface Props {
  currentUser: User;
  posts: Post[];
  onSignOut: () => void;
  onNewPost: () => void;
  onToggleLike: (postId: string) => void;
  onSelectSong: (postId: string, songId: string) => void;
}

export function HomePage({ currentUser, posts, onSignOut, onNewPost, onToggleLike, onSelectSong }: Props) {
  return (
    <div style={{ background: '#08080f', minHeight: '100vh' }}>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(8,8,15,0.88)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(120,80,200,0.12)',
          padding: '0 16px',
        }}
      >
        <div
          style={{
            maxWidth: '470px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            height: '56px',
            gap: '12px',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Music2 size={17} color="#fff" />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#f0effa', letterSpacing: '-0.02em' }}>
              Vibes
            </span>
          </div>

          {/* User avatar */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${currentUser.avatarColor[0]}, ${currentUser.avatarColor[1]})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
              color: '#fff',
              cursor: 'default',
            }}
            title={currentUser.username}
          >
            {currentUser.displayName[0].toUpperCase()}
          </div>

          {/* Sign out */}
          <button
            onClick={onSignOut}
            title="Sign out"
            style={{
              background: 'rgba(120,80,200,0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#7070a0',
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#f0effa';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(120,80,200,0.25)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#7070a0';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(120,80,200,0.12)';
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Feed */}
      <main style={{ maxWidth: '470px', margin: '0 auto', padding: '20px 16px 100px' }}>
        {posts.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: '80px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                background: 'rgba(168,85,247,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
              }}
            >
              <Music2 size={32} color="#a855f7" />
            </div>
            <div style={{ color: '#f0effa', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              No posts yet
            </div>
            <div style={{ color: '#7070a0', fontSize: '14px', marginBottom: '24px' }}>
              Share a photo and find the perfect song for it.
            </div>
            <button
              onClick={onNewPost}
              style={{
                padding: '12px 28px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(168,85,247,0.3)',
              }}
            >
              Create your first post
            </button>
          </div>
        )}

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onToggleLike={() => onToggleLike(post.id)}
            onSelectSong={(songId) => onSelectSong(post.id, songId)}
          />
        ))}
      </main>

      {/* FAB */}
      <button
        onClick={onNewPost}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '50%',
          transform: 'translateX(calc(235px + 16px))',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 28px rgba(168,85,247,0.45)',
          transition: 'transform 0.15s, box-shadow 0.15s',
          zIndex: 30,
        }}
        title="New Post"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 36px rgba(168,85,247,0.65)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 28px rgba(168,85,247,0.45)';
        }}
      >
        <Plus size={24} color="#fff" />
      </button>
    </div>
  );
}

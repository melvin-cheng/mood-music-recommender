import { useState } from 'react';
import { Heart, MessageCircle, Share2, Music2, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SongSwiper } from './SongSwiper';
import { ImageWithFallback } from './ImageWithFallback';
import type { Post } from '../App';

interface Props {
  post: Post;
  onToggleLike: () => void;
  onSelectSong: (songId: string) => void;
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function PostCard({ post, onToggleLike, onSelectSong }: Props) {
  const [showSongs, setShowSongs] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);

  const handleLike = () => {
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 300);
    onToggleLike();
  };

  const selectedSong = post.songs.find((s) => s.id === post.selectedSongId);

  return (
    <div
      style={{
        background: '#0f0f1e',
        borderRadius: '20px',
        border: '1.5px solid rgba(120,80,200,0.14)',
        overflow: 'hidden',
        marginBottom: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 16px',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${post.user.avatarColor[0]}, ${post.user.avatarColor[1]})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {post.user.displayName[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f0effa' }}>
            {post.user.username}
          </div>
          <div style={{ fontSize: '11px', color: '#7070a0' }}>{timeAgo(post.timestamp)}</div>
        </div>
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7070a0', padding: '4px' }}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1 / 1' }}>
        <ImageWithFallback
          src={post.imageUrl}
          alt={post.caption}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Selected song overlay */}
        <AnimatePresence>
          {selectedSong && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(8, 8, 15, 0.82)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                padding: '10px 12px',
                border: '1px solid rgba(168,85,247,0.3)',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${selectedSong.gradient[0]}, ${selectedSong.gradient[1]})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Music2 size={16} color="rgba(255,255,255,0.8)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', color: '#f0effa', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedSong.title}
                </div>
                <div style={{ fontSize: '11px', color: '#9070c0' }}>{selectedSong.artist}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '3px',
                  alignItems: 'flex-end',
                  height: '16px',
                }}
              >
                {[3, 5, 4, 6, 3].map((h, i) => (
                  <motion.div
                    key={i}
                    style={{
                      width: '3px',
                      borderRadius: '2px',
                      background: 'linear-gradient(to top, #a855f7, #ec4899)',
                    }}
                    animate={{ height: [h, h + 4, h] }}
                    transition={{ repeat: Infinity, duration: 0.8 + i * 0.1, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '12px 16px 8px',
        }}
      >
        <button
          onClick={handleLike}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: post.liked ? '#ec4899' : '#7070a0',
            padding: 0,
            transition: 'color 0.15s ease',
          }}
        >
          <motion.div
            animate={likeAnimating ? { scale: [1, 1.4, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              size={22}
              fill={post.liked ? '#ec4899' : 'none'}
              color={post.liked ? '#ec4899' : '#7070a0'}
            />
          </motion.div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{post.likes}</span>
        </button>

        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#7070a0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: 0,
          }}
        >
          <MessageCircle size={22} />
        </button>

        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#7070a0',
            padding: 0,
          }}
        >
          <Share2 size={22} />
        </button>

        <div style={{ flex: 1 }} />

        {/* Music toggle */}
        <button
          onClick={() => setShowSongs((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '99px',
            border: 'none',
            background: showSongs
              ? 'linear-gradient(135deg, #a855f7, #ec4899)'
              : 'rgba(120,80,200,0.18)',
            color: showSongs ? '#fff' : '#a855f7',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
        >
          <Music2 size={14} />
          {selectedSong ? 'Change Song' : 'Pick a Song'}
        </button>
      </div>

      {/* Caption */}
      <div style={{ padding: '4px 16px 12px' }}>
        <span style={{ fontSize: '13px', color: '#f0effa' }}>
          <span style={{ fontWeight: 700 }}>{post.user.username} </span>
          {post.caption}
        </span>
      </div>

      {/* Song swiper */}
      <AnimatePresence>
        {showSongs && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '12px 16px 16px',
                borderTop: '1px solid rgba(120,80,200,0.12)',
              }}
            >
              <SongSwiper
                songs={post.songs}
                selectedSongId={post.selectedSongId}
                onSelect={onSelectSong}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

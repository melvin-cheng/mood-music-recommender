import useEmblaCarousel from 'embla-carousel-react';
import { Check, Music2 } from 'lucide-react';
import type { Song } from '../App';

interface Props {
  songs: Song[];
  selectedSongId: string | null;
  onSelect: (songId: string) => void;
}

export function SongSwiper({ songs, selectedSongId, onSelect }: Props) {
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: 'keepSnaps',
    align: 'start',
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <Music2 size={14} color="#a855f7" />
        <span style={{ fontSize: '12px', color: '#7070a0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Songs for this vibe
        </span>
      </div>

      <div ref={emblaRef} style={{ overflow: 'hidden', margin: '0 -16px', padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {songs.map((song) => {
            const isSelected = selectedSongId === song.id;
            return (
              <div
                key={song.id}
                onClick={() => onSelect(song.id)}
                style={{
                  flex: '0 0 248px',
                  borderRadius: '14px',
                  padding: '12px',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(168,85,247,0.22), rgba(236,72,153,0.14))'
                    : '#1a1a30',
                  border: isSelected
                    ? '1.5px solid rgba(168,85,247,0.6)'
                    : '1.5px solid rgba(120,80,200,0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {/* Album art */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${song.gradient[0]}, ${song.gradient[1]})`,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Music2 size={22} color="rgba(255,255,255,0.6)" />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#f0effa',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {song.title}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#7070a0',
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {song.artist}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 7px',
                        borderRadius: '99px',
                        background: isSelected ? 'rgba(168,85,247,0.3)' : 'rgba(120,80,200,0.18)',
                        color: isSelected ? '#c084fc' : '#9070c0',
                        fontWeight: 500,
                      }}
                    >
                      {song.vibe}
                    </span>
                    <span style={{ fontSize: '10px', color: '#7070a0' }}>{song.duration}</span>
                  </div>
                </div>

                {/* Check */}
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: isSelected
                      ? 'linear-gradient(135deg, #a855f7, #ec4899)'
                      : 'rgba(120,80,200,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Check size={12} color={isSelected ? '#fff' : '#7070a0'} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useCallback } from 'react';
import { X, ImagePlus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onClose: () => void;
  onCreate: (imageUrl: string, caption: string) => void;
}

export function CreatePostModal({ onClose, onCreate }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = () => {
    if (!preview || !caption.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onCreate(preview, caption.trim());
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(4, 4, 10, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        style={{
          background: '#0f0f1e',
          borderRadius: '24px',
          border: '1.5px solid rgba(120,80,200,0.22)',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px',
            borderBottom: '1px solid rgba(120,80,200,0.12)',
          }}
        >
          <h2 style={{ color: '#f0effa', margin: 0 }}>New Post</h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(120,80,200,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#c8c7e8',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Upload area */}
          <div
            onClick={() => !preview && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            style={{
              borderRadius: '16px',
              border: isDragging
                ? '2px dashed #a855f7'
                : preview
                ? '2px solid rgba(120,80,200,0.2)'
                : '2px dashed rgba(120,80,200,0.3)',
              overflow: 'hidden',
              aspectRatio: '1 / 1',
              background: isDragging ? 'rgba(168,85,247,0.08)' : '#1a1a30',
              cursor: preview ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(8,8,15,0.75)',
                    border: '1px solid rgba(120,80,200,0.3)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#f0effa',
                  }}
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.15))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                  }}
                >
                  <ImagePlus size={26} color="#a855f7" />
                </div>
                <div style={{ color: '#f0effa', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                  Drop your photo here
                </div>
                <div style={{ color: '#7070a0', fontSize: '12px' }}>
                  or click to browse
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />

          {/* Caption */}
          <div style={{ marginTop: '16px' }}>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption…"
              maxLength={2200}
              rows={3}
              style={{
                width: '100%',
                background: '#1a1a30',
                border: '1.5px solid rgba(120,80,200,0.2)',
                borderRadius: '12px',
                padding: '12px 14px',
                color: '#f0effa',
                fontSize: '14px',
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                lineHeight: '1.5',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(168,85,247,0.5)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(120,80,200,0.2)')}
            />
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#7070a0', marginTop: '4px' }}>
              {caption.length} / 2200
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!preview || !caption.trim() || isSubmitting}
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background:
                !preview || !caption.trim()
                  ? 'rgba(120,80,200,0.2)'
                  : 'linear-gradient(135deg, #a855f7, #ec4899)',
              color: !preview || !caption.trim() ? '#7070a0' : '#fff',
              fontSize: '15px',
              fontWeight: 700,
              cursor: !preview || !caption.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'opacity 0.2s',
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Posting…
              </>
            ) : (
              'Share Post'
            )}
          </button>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}

import { useState } from 'react';
import { Music2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { User } from '../App';

interface Props {
  onAuth: (user: User) => void;
}

const AVATAR_GRADIENTS: [string, string][] = [
  ['#7c3aed', '#c026d3'],
  ['#db2777', '#9333ea'],
  ['#0284c7', '#7c3aed'],
  ['#16a34a', '#0284c7'],
  ['#d97706', '#dc2626'],
];

export function AuthPage({ onAuth }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (mode === 'signup' && !username) {
      setError('Please choose a username.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const gradient = AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)];
      const displayName = mode === 'signup' ? username : email.split('@')[0];
      const user: User = {
        id: `user-${Date.now()}`,
        username: (mode === 'signup' ? username : email.split('@')[0]).toLowerCase().replace(/\s+/g, '_'),
        displayName,
        avatarColor: gradient,
      };
      onAuth(user);
    }, 800);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#08080f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 40px rgba(168,85,247,0.35)',
            }}
          >
            <Music2 size={32} color="#fff" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#f0effa', letterSpacing: '-0.02em' }}>
            Vibes
          </div>
          <div style={{ fontSize: '14px', color: '#7070a0', marginTop: '6px' }}>
            Find your song. Tell your story.
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#0f0f1e',
            borderRadius: '24px',
            border: '1.5px solid rgba(120,80,200,0.2)',
            padding: '32px',
          }}
        >
          {/* Mode toggle */}
          <div
            style={{
              display: 'flex',
              background: '#1a1a30',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '28px',
            }}
          >
            {(['signin', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '9px',
                  border: 'none',
                  background: mode === m ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'transparent',
                  color: mode === m ? '#fff' : '#7070a0',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', marginBottom: '14px' }}
                >
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    style={{
                      width: '100%',
                      background: '#1a1a30',
                      border: '1.5px solid rgba(120,80,200,0.2)',
                      borderRadius: '12px',
                      padding: '13px 16px',
                      color: '#f0effa',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(168,85,247,0.6)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(120,80,200,0.2)')}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ marginBottom: '14px' }}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                style={{
                  width: '100%',
                  background: '#1a1a30',
                  border: '1.5px solid rgba(120,80,200,0.2)',
                  borderRadius: '12px',
                  padding: '13px 16px',
                  color: '#f0effa',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(168,85,247,0.6)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(120,80,200,0.2)')}
              />
            </div>

            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                style={{
                  width: '100%',
                  background: '#1a1a30',
                  border: '1.5px solid rgba(120,80,200,0.2)',
                  borderRadius: '12px',
                  padding: '13px 48px 13px 16px',
                  color: '#f0effa',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(168,85,247,0.6)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(120,80,200,0.2)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#7070a0',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#f87171',
                }}
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.2s',
                boxShadow: '0 4px 24px rgba(168,85,247,0.3)',
              }}
            >
              {loading ? '…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#7070a0', marginTop: '20px' }}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}

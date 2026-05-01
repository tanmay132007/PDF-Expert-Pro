import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnvelopeSimple, LockKey, Eye, EyeSlash, GoogleLogo, AppleLogo, FacebookLogo } from '@phosphor-icons/react';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      
      {/* Top Section */}
      <div style={{
        backgroundColor: 'var(--secondary-500)',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        padding: '48px 20px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <div style={{ width: 48, height: 48, backgroundColor: 'var(--primary-500)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Logo size={48} />
        </div>
        <h1 className="heading-h2" style={{ color: '#FFFFFF', marginTop: 16 }}>PDF Expert Pro</h1>
        <p className="body-md" style={{ color: 'var(--text-muted)', marginTop: 4 }}>Welcome back</p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSignIn} style={{ padding: '28px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {error && (
          <div style={{ backgroundColor: '#FFF5F5', color: 'var(--semantic-error)', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13, border: '1px solid #FED7D7' }}>
            {error}
          </div>
        )}

        <div className="input-container">
          <EnvelopeSimple size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 18, zIndex: 1 }} />
          <input
            id="email"
            type="email"
            className="input-field"
            style={{ paddingLeft: 44 }}
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label htmlFor="email" className="input-label" style={{ left: 44 }}>Email address</label>
        </div>

        <div className="input-container">
          <LockKey size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 18, zIndex: 1 }} />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className="input-field monospace"
            style={{ paddingLeft: 44, paddingRight: 44 }}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <label htmlFor="password" className="input-label" style={{ left: 44 }}>Password</label>
          <div 
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 16, top: 18, cursor: 'pointer' }}
          >
            {showPassword ? <EyeSlash size={20} color="var(--text-muted)" /> : <Eye size={20} color="var(--text-muted)" />}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: 'var(--primary-500)', cursor: 'pointer' }}>
            Forgot password?
          </span>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Social Buttons (UI Only for now as per design) */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-default)' }} />
          <span className="caption" style={{ color: 'var(--text-muted)', margin: '0 12px' }}>or continue with</span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-default)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button type="button" style={{ width: 56, height: 56, borderRadius: 12, border: '1px solid var(--border-default)', backgroundColor: 'var(--surface-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <GoogleLogo size={24} weight="bold" />
          </button>
          <button type="button" style={{ width: 56, height: 56, borderRadius: 12, border: 'none', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <AppleLogo size={24} weight="fill" color="#FFFFFF" />
          </button>
          <button type="button" style={{ width: 56, height: 56, borderRadius: 12, border: 'none', backgroundColor: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <FacebookLogo size={24} weight="fill" color="#FFFFFF" />
          </button>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ textAlign: 'center', marginTop: 24, paddingBottom: 24 }}>
          <span className="body-md" style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
          <span onClick={() => navigate('/auth/signup')} style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: 'var(--primary-500)', cursor: 'pointer' }}>
            Sign Up
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignIn;

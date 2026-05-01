import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnvelopeSimple, LockKey, Eye, EyeSlash, User } from '@phosphor-icons/react';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { full_name: name } }
      });
      if (error) throw error;
      alert("Check your email for verification!");
      navigate('/auth/signin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 8) return 2;
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 3;
    return 4;
  };

  const strength = getStrength();
  const strengthColors = ['#E2E8F0', '#E53E3E', '#D69E2E', '#38A169', 'var(--primary-500)'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      
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
        <h1 className="heading-h2" style={{ color: '#FFFFFF', marginTop: 16 }}>Create Account</h1>
        <p className="body-md" style={{ color: 'var(--text-muted)', marginTop: 4 }}>Join PDF Expert Pro</p>
      </div>

      <form onSubmit={handleSignUp} style={{ padding: '28px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {error && (
          <div style={{ backgroundColor: '#FFF5F5', color: 'var(--semantic-error)', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13, border: '1px solid #FED7D7' }}>
            {error}
          </div>
        )}

        <div className="input-container">
          <User size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 18, zIndex: 1 }} />
          <input
            id="name"
            type="text"
            className="input-field"
            style={{ paddingLeft: 44 }}
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <label htmlFor="name" className="input-label" style={{ left: 44 }}>Full name</label>
        </div>

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

        <div className="input-container" style={{ marginBottom: '16px' }}>
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

        <div className="input-container" style={{ marginBottom: '8px' }}>
          <LockKey size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 18, zIndex: 1 }} />
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            className="input-field monospace"
            style={{ paddingLeft: 44, paddingRight: 44 }}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword" className="input-label" style={{ left: 44 }}>Confirm Password</label>
        </div>

        {/* Strength Bar */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', padding: '0 4px' }}>
          {[1, 2, 3, 4].map(level => (
            <div key={level} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: strength >= level ? strengthColors[strength] : '#E2E8F0', transition: 'background-color 0.3s' }} />
          ))}
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div style={{ flex: 1 }} />

        <div style={{ textAlign: 'center', marginTop: 24, paddingBottom: 24 }}>
          <span className="body-md" style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <span onClick={() => navigate('/auth/signin')} style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: 'var(--primary-500)', cursor: 'pointer' }}>
            Sign In
          </span>
          <div className="caption" style={{ color: 'var(--text-muted)', marginTop: 12 }}>
            By signing up you agree to our <span style={{ color: 'var(--primary-500)', textDecoration: 'underline', cursor: 'pointer' }}>Terms & Privacy Policy</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;

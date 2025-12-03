import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, getUserProfile } from '../store/authSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Loader from '../components/Loader';

const SignInPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(login(credentials)).unwrap();
      
      // If "Remember me" is not checked, we'll still need to handle the token
      // but we could remove it on browser close (handled by sessionStorage instead)
      if (!rememberMe) {
        // Store in sessionStorage instead of localStorage for this session only
        sessionStorage.setItem('token', result.token);
        localStorage.removeItem('token');
      }
      
      // Fetch user profile after successful login
      await dispatch(getUserProfile()).unwrap();
      
    } catch (err) {
      // Error is handled in the Redux slice
      console.error('Login failed:', err);
    }
  };

  return (
    <>
      <Header />
      <main className="main bg-dark">
        <section className="sign-in-content">
          <i className="fa fa-user-circle sign-in-icon"></i>
          <h1>Sign In</h1>
          {error && (
            <div style={{ 
              color: '#d32f2f', 
              backgroundColor: '#ffebee', 
              padding: '0.75rem', 
              marginBottom: '1rem',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Email"
              id="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Password"
              id="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <div className="input-remember">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <Button
              type="submit"
              className="sign-in-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          {isLoading && <Loader message="Signing you in..." />}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SignInPage;
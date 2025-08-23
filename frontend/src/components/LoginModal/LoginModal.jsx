import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginModal.css';

function LoginModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        closeModal();
        navigate('/dashboard');
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({credential: 'demo@user.io', password: 'password'}))
      .then(() => {
        closeModal();
        navigate('/dashboard');
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="login-modal">
      <div className="login-modal-header">
        <h1>Log In</h1>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {errors.credential && (
          <div className="error-message">{errors.credential}</div>
        )}

        <button type="submit" className="login-button">Sign In</button>

        <div className="demo-login-section">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="demo-login-button"
          >
            Login as Demo Account
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginModal;

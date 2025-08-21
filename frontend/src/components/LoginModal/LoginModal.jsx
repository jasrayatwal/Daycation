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
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit">Log In</button>

        <div className="demo-login-section">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="demo-login-button"
          >
            Log in as Demo User
          </button>
        </div>
      </form>
    </>
  );
}

export default LoginModal;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ROUTES } from '../utils/routes';
import { signIn } from '../utils/mutations';

export const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
    },
    onError: (error) => {
      console.error('Error signing in', error);
    }
  });
  
  const handleSubmit = (event) => {
    event.preventDefault()
    mutate({ email, password })
  }

  return (
    <>
      <div>
        <h1>Welcome back!</h1>
        <p>Do not have an account yet? <Link to={ROUTES.SIGN_UP}>Create account</Link></p>
      </div>
      <div className='box'>
        <form onSubmit={handleSubmit}>
          <label>Email <span className='important'>*</span></label>
          <input type="email" value={email} id='email' onChange={(e) => setEmail(e.target.value)} required placeholder='you@henrique.dev' />
          <label>Password <span className='important'>*</span></label>
          <input type='password' value={password} id="password" onChange={(e) => setPassword(e.target.value)} required placeholder='Your password' />
          <Link to={ROUTES.FORGOT_PASSWORD} className='forgot'>Forgot password?</Link>
          <button type='submit' disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign in'}</button>
          {isError && <p className='important'>Error: {error.message}</p>}
        </form>
      </div>
    </>
  )
}

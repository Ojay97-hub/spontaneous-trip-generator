// src/GoogleLoginButton.jsx
import { GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton({ onLoginSuccess }) {
  return (
    <GoogleLogin
      onSuccess={credentialResponse => {
        // credentialResponse.credential is the Google ID token
        if (onLoginSuccess) {
          onLoginSuccess(credentialResponse.credential);
        }
      }}
      onError={() => {
        alert('Google Login Failed');
      }}
      useOneTap
    />
  );
}

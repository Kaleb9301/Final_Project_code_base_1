import SignUpForm from './sign-up-form';
import AuthWrapper from '../auth-wrapper-one';


export default function SignIn() {
  return (
    <AuthWrapper
      title={
        <>
          Welcome to Drought Prediction! <br /> Sign in with your credentials.
        </>
      }
    >
      <SignUpForm />
    </AuthWrapper>
  );
}

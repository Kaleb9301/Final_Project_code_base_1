import SignInForm from './sign-in-form';
import AuthWrapper from '../auth-wrapper-one';
import { routes } from '@/config/routes';


export default function SignIn() {
  return (
    <AuthWrapper
      title={
        <>
          Welcome to Drought Prediction! <br /> Sign in with your credentials.
        </>
      }
    >
      <SignInForm />
     
    </AuthWrapper>
  );
}

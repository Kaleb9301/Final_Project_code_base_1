import { signIn, useSession } from 'next-auth/react';
import { SubmitHandler } from 'react-hook-form';
import { Password } from '@/components/ui/password';
import { Checkbox } from '@/components/ui/checkbox';
import { useMedia } from '@/hooks/use-media';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { loginSchema, LoginSchema } from '@/utils/validators/login.schema';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/use-auth';
import http, { defaultHttp } from '@/utils/http';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '@/config/routes';

export default function SignInForm() {
  const isMedium = useMedia('(max-width: 1200px)', false);
  let { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  
  const from = routes.dashboard;

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    await http.post("/auth/login/", { ...data }).then(async (response: any) => {
      if (response.status === 200) {
        localStorage.clear();
        localStorage.setItem("token", response?.data?.key)
        const res = await http?.get("/auth/get_me/");
        localStorage.setItem("username", data?.username)
        localStorage.setItem("email", res?.data?.email)
        localStorage.setItem("role", res?.data?.profile?.role)
        
        navigate(from, { replace: true });
      } else {
      toast.error("Wrong Credentials!");
      }
    })
  };

  return (
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
        onSubmit={onSubmit}
        useFormProps={{
          mode: 'onChange',
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5 lg:space-y-6">
            <Input
              type="text"
              size={isMedium ? 'lg' : 'xl'}
              label="Username"
              placeholder="Enter your username"
              className="[&>label>span]:font-medium"
              {...register('username')}
              error={errors.username?.message}
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size={isMedium ? 'lg' : 'xl'}
              className="[&>label>span]:font-medium"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex items-center justify-between pb-1">
              {/* <Checkbox
                {...register('rememberMe')}
                label="Remember Me"
                className="[&>label>span]:font-medium"
              /> */}
            </div>

            <Button
              className="w-full"
              type="submit"
              size={isMedium ? 'lg' : 'xl'}
            >
              Sign In
            </Button>

          </div>
          
        )}
      </Form>
      <Button
        className="w-full mt-3 bg-slate-700"
        onClick={() => navigate(routes.auth.signUp)}
        type="button"
        size={isMedium ? 'lg' : 'xl'}>
          Sign UP
      </Button>
    </>
  );
}

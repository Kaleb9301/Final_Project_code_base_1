import { signIn, useSession } from 'next-auth/react';
import { SubmitHandler } from 'react-hook-form';
import { Password } from '@/components/ui/password';
import { Checkbox } from '@/components/ui/checkbox';
import { useMedia } from '@/hooks/use-media';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { signUpInput, SignUpSchema } from '@/utils/validators/signup.schema';
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
  
  const from = routes.auth.signIn;

  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    await http.post("/auth/register/", { ...data, profile: {phone_number: data.phone_number, role: "regular", grand_father_name: "not required"} }).then(async (response: any) => {
      if (response.status === 201) {
        toast.success("User Registered Successfully");
         setTimeout(() => {
          // console.log(' data ->', data);
        }, 600);   
        
        navigate(from, { replace: true });
      } else {
      // toast.error("Wrong Credentials!");
      }
    })
  };

  return (
    <>
      <Form<SignUpSchema>
        validationSchema={signUpInput}
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
            <Input
              type="text"
              size={isMedium ? 'lg' : 'xl'}
              label="First Name"
              placeholder="Enter your first name"
              className="[&>label>span]:font-medium"
              {...register('first_name')}
              error={errors.first_name?.message}
            />
            <Input
              type="text"
              size={isMedium ? 'lg' : 'xl'}
              label="Last Name"
              placeholder="Enter your last name"
              className="[&>label>span]:font-medium"
              {...register('last_name')}
              error={errors.last_name?.message}
            />
            <Input
              type="email"
              size={isMedium ? 'lg' : 'xl'}
              {...register("email")}
              label="Email"
              placeholder="enter your email"
              className="[&>label>span]:font-medium"
              error={errors.email?.message}
            />
            <Input
              type="text"
              size={isMedium ? 'lg' : 'xl'}
              label="Phone Number"
              placeholder="Enter your phone number"
              className="[&>label>span]:font-medium"
              {...register('phone_number')}
              error={errors.phone_number?.message}
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

            </div>

            <Button
              className="w-full"
              type="submit"
              size={isMedium ? 'lg' : 'xl'}
            >
              Sign Up
            </Button>
          </div>
        )}
      </Form>
    </>
  );
}

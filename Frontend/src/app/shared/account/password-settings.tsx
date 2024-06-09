import { useState } from 'react';
import { SubmitHandler, Controller } from 'react-hook-form';
import { PiDesktop } from 'react-icons/pi';
import cn from '@/utils/class-names';
import { Form } from '@/components/ui/form';
import { Title, Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { ProfileHeader } from './profile-settings';
import { Password } from '@/components/ui/password';
import HorizontalFormBlockWrapper from './horiozontal-block';
import {
  passwordFormSchema,
  PasswordFormTypes,
} from '@/utils/validators/password-settings.schema';
import useAuth from '@/hooks/use-auth';
import http from '@/utils/http';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';

export default function PasswordSettingsView({
  settings,
}: {
  settings?: PasswordFormTypes;
}) {
  const [isLoading, setLoading] = useState(false);
  const [reset, setReset] = useState({});

  const onSubmit: SubmitHandler<PasswordFormTypes> = async (data: PasswordFormTypes) => {
    try {
      const response = await http.put("/auth/change_password/", { password: data?.newPassword });
      
      if (response.status === 200) {
         toast.success(
           <Text as="b" className="font-semibold">
             Password Updated successfully!
           </Text>
         );

        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setReset({
            newPassword: '',
            confirmedPassword: '',
          });
        }, 600);   
      }
    } catch {
      
    }
  };

  const fetchData = async () => {
    try {
      const response = await http.get(`/v1/auth/me`);
      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };
   
  const [password, setPassword] = useState<string>();
  const [confirm_password, setConfirmPassword] = useState<string>();
  const [passwordError, setPasswordError] = useState(false);

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handlePasswordValue = async () => {
    if (confirm_password != password) {
        setPasswordError(true)
       } else {
         setPasswordError(false);
      }
  };

  const handleConfirmPasswordChange = async (event: any) => {
    setConfirmPassword(event.target.value);
    if (event.target.value != password) {
        setPasswordError(true)
       } else {
         setPasswordError(false);
      }
  };

  const { auth } = useAuth();
  return (
    <>
      <Form<PasswordFormTypes>
        validationSchema={passwordFormSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        className="@container"
        useFormProps={{
          mode: 'onChange',
          defaultValues: {
            ...settings,
          },
        }}
      >
        {({ register, control, formState: { errors }, getValues }) => {
          return (
            <>
              <div className='mx-10'>
              <ProfileHeader
                title={auth?.username}
                description={auth?.email}
              />

              <div className="mx-auto w-full max-w-screen-2xl">
                <HorizontalFormBlockWrapper
                  title="New Password"
                  titleClassName="text-base font-medium"
                >
     
                <Password
                  placeholder="Enter your password"
                  {...register("newPassword")}
                  helperText={
                    'Your current password must be more than 6 characters'
                  }
                  onBlurCapture={handlePasswordValue}
                  onChange={handlePasswordChange}
                  error={errors.newPassword?.message}
                  />
                
                </HorizontalFormBlockWrapper>

                <HorizontalFormBlockWrapper
                  title="Confirm New Password"
                  titleClassName="text-base font-medium"
                >
                 <Password
                  placeholder="Enter your password"
                  {...register("confirmedPassword")}
                  onBlurCapture={handlePasswordValue}
                  onChange={handleConfirmPasswordChange}
                  helperText={
                    'Your current password must be more than 6 characters'
                  }
                  error={ passwordError ? "Password Must much!": ""}
                  />
                </HorizontalFormBlockWrapper>

                <div className="mt-6 flex w-auto items-center justify-end gap-3">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" variant="solid" isLoading={isLoading}>
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
            </>
          );
        }}
      </Form>
    </>
  );
}

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Controller, SubmitHandler } from 'react-hook-form';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { Text, Title } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';


import { useMutation, useQueryClient } from 'react-query';
import http from '@/utils/http';


export default function UpdatePasswordModalView({ id}: {id: number}) {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
    
  const queryClient = useQueryClient();

  const updateSuperAgentPassword = useMutation(async( new_password: string ) => {
    const response = await http?.put(`/v1/admin/password-reset/${id}`,  { new_password })
      if (response?.status === 200) {
        toast.success(
           <Text as="b" className="font-semibold">
             Password Updated successfully!
           </Text>
         );

        setLoading(true);
        closeModal();
        setTimeout(() => {
          setLoading(false);
          setReset({
            new_password: ''
          });
        }, 600);   
      } else {
        console.log(response.status)
      }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('super_agent');
    },
  });


  const onSubmit: SubmitHandler<any> = async(data: any) => {
    try {
      if(data?.new_password === data?.confirm_password)
        updateSuperAgentPassword.mutate(data?.new_password);
    } catch(error) {
      // catch-error
      console.log(error)
    }
  };

  return (
    <div className="m-auto p-6">
      <Title as="h3" className="mb-6 text-lg">
        Update Password
      </Title>
      <Form<any>
        resetValues={reset}
        onSubmit={onSubmit}
      >
        {({ register, control, formState: { errors } }) => (
          <>
            <PasswordForm control={control} register={register} errors={errors} />
            <div className="mt-8 flex justify-end gap-3">
              <Button
                className="w-auto"
                variant="outline"
                onClick={() => closeModal()}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading} className="w-auto">
                Update
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}

export function PasswordForm({ register, control, errors }: any) {
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

  return (
    <div className="flex flex-col gap-4 text-gray-700">
      <Input
        type="password"
        label="Password"
        labelClassName="text-sm font-medium text-gray-900"
        placeholder="Password"
        {...register('new_password')}
        onBlurCapture={handlePasswordValue}
        onChange={handlePasswordChange}
      />
      <Input
        type="password"
        label="Confirm password"
        labelClassName="text-sm font-medium text-gray-900"
        placeholder="Password"
        {...register('confirm_password')}
        onBlurCapture={handlePasswordValue}
        onChange={handleConfirmPasswordChange}
        error={ passwordError ? "Password Must much!": null}
      />
    </div>
  );
}

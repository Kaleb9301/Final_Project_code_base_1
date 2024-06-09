'use client';

import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { SubmitHandler, Controller } from 'react-hook-form';
import { PiClock, PiEnvelopeSimple } from 'react-icons/pi';
import { Form } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';
import FormFooter from '@/components/form-footer';
import InputComponentCreator, { getInputValues } from '@/components/ui/list-input';
import {
  defaultValues,
  FormSchema,
  FormTypes,
} from '@/utils/validators/form.schema';
import { categories } from '@/data/forms/my-details';
import makeServerCall, { makeServerCallJSON } from '../api/auth/[...nextauth]/server-call';
import { useState } from 'react';
import { ProFormUploadButton } from '@ant-design/pro-components';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Select = dynamic(
  () => import('@/components/ui/select').then((mod) => mod.Select),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-10 place-content-center">
        <Spinner />
      </div>
    ),
  }
);

export default function DynamicForm({ uploadVisible = false }: { uploadVisible?: Boolean; }) {
  const [reset, setReset] = useState({});
  const [componentReset, setComponentReset] = useState(false);
  const router = useRouter();
  const session = useSession();

  if (!session) router.push("/api/auth/signin");

  const onSubmit: SubmitHandler<FormTypes> = async (data) => {
    console.log({ data })
    console.log({ ...getInputValues() })

    try {
      if (!uploadVisible) {
        const response = await makeServerCallJSON('/v1/post/create', 'POST', {
         ...data, ...getInputValues()
        });
  
        if (response?.status === 201) {
          setReset({ ...defaultValues });
          setComponentReset(prev=>!prev)
          toast.success(<Text as="b">Successfully added!</Text>);
        } 
      } else {
          const response = await makeServerCall('/v1/post/create-with-file', 'POST', {
            ...data, ...getInputValues()
          });
        
        console.log(response)
      }
    } catch (error) {
        toast.error(<Text as="b">Server Error</Text>);
    }
  };

  return (
    <div className='mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-2xl 2xl:pb-8 2xl:pt-2'>      
      <div className="col-span-full flex items-center justify-center @5xl:col-span-7">
            <Form<FormTypes>
              validationSchema={FormSchema}
          resetValues={reset}
              onSubmit={onSubmit}
              className="@container grid flex-grow gap-6 rounded-lg p-5 @4xl:p-7"
              useFormProps={{
                mode: 'onChange',
                defaultValues,
              }}
            >
              {({ register, control, setValue, getValues, formState: { errors } }) => {
                return (
                  <>

                    <div className="mb-10 grid gap-7 @2xl:gap-9 @3xl:gap-11">
                      <Input
                          label="Title"
                          labelClassName="font-semibold text-gray-900"
                          placeholder="Title"
                          {...register('title')}
                          error={errors.title?.message}
                          className="col-span-full flex-grow"
                        />
    
                      <Input
                          label="Content"
                          labelClassName="font-semibold text-gray-900"
                          type="text"
                          placeholder="Content"
                          {...register('content')}
                          error={errors.content?.message}
                        />

                      <InputComponentCreator
                        label="References"
                        resetValues={componentReset}
                        error={errors.references?.message}
                        {...register('references')}
                        buttonText='Add Reference'
                        placeholder='Reference' />
                      
                      <InputComponentCreator
                        label="Tags"
                        resetValues={componentReset}
                        error={errors.tags?.message}
                        {...register('tags')}
                        placeholder="Tag"
                        buttonText='Add Tags' />
                      
                      <InputComponentCreator
                        label="Video Links"
                        name="videos"
                        upload={uploadVisible}
                        resetValues={componentReset}
                        // {...register('videos')}
                        placeholder='Video Link'
                        buttonText='Add Video Links' />
                      
                      <InputComponentCreator
                        label="Image Links"
                        name="images"
                        upload={uploadVisible}
                        resetValues={componentReset}
                        // {...register('images')}
                        placeholder = "Image Link"
                        buttonText='Add Image Links' />
                      
                
                        <Controller
                          control={control}
                          name="category"
                          render={({ field: { value, onChange } }) => (
                            <Select
                              label="Category"
                              labelClassName="font-semibold text-gray-900"
                              placeholder="Select Category"
                              options={categories}
                              onChange={onChange}
                              value={value}
                              className="col-span-full"
                              getOptionValue={(option) => option.value}
                              displayValue={(selected) =>
                                categories?.find((c) => c.value === selected)?.label ?? ''
                              }
                              error={errors?.category?.message as string}
                            />
                          )}
                      />
                    </div>

                    <FormFooter
                      // isLoading={isLoading}
                      altBtnText="Cancel"
                      submitBtnText="Save"
                    />
                  </>
                );
              }}
        </Form>
      </div>
    </div>
  );
}

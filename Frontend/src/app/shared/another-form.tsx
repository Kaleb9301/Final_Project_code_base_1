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
import {
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormList,
  ProFormSelect,
  ProFormText,
  conversionMomentValue,
  ProFormUploadButton
} from '@ant-design/pro-components';
import InputComponentCreator, { getInputValues } from '@/components/ui/list-input';
import {
  defaultValues,
  FormSchema,
  FormTypes,
} from '@/utils/validators/form.schema';
import { categories } from '@/data/forms/my-details';
import makeServerCall from '../api/auth/[...nextauth]/server-call';
import { useState } from 'react';
import { Button } from 'rizzui';

import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DynamicForm({ uploadVisible = false }: { uploadVisible?: Boolean; }) {
  const [reset, setReset] = useState({});
  const [componentReset, setComponentReset] = useState(false);
  const [type, setType] = useState('ProForm');
  const [form] = ProForm.useForm();
  const router = useRouter();
  const session = useSession();

  if (!session) router.push("/api/auth/signin");

  const Components: any = {
    ProForm,
  };
  
  const FormComponents = Components[type];

  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log({...getInputValues()})
    try {

    var formdata = new FormData();
    formdata.append("title", data?.title);
    formdata.append("content", data?.content);
    formdata.append("references", getInputValues()?.references as any)
    formdata.append("tags", getInputValues()?.tags as any);
    for (let i = 0; i < data?.images?.length; i++) {
        const file = data?.images[i];
        const blob = await fetch(file).then((response) => response.blob());
        formdata.append('images', blob, file.name);
    }

    for (let i = 0; i < data?.videos?.length; i++) {
        const file = data?.videos[i];
        const blob = await fetch(file).then((response) => response.blob());
        formdata.append('videos', blob, file.name);
    }

    formdata.append("category", data?.category);

    
      const response = await makeServerCall('/v1/post/create-with-file', 'POST', formdata);
      console.log({status: response?.status})
      if(response?.status === 201){
        form.setFieldsValue({})
        toast.success(<Text as="b">Successfully added!</Text>);
      }

    }catch(error){
      //do something else
    }
  };

  return (
    <div className='mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-2xl 2xl:pb-8 2xl:pt-2'>      
      <div className="col-span-full flex items-center justify-center @5xl:col-span-7">
        <FormComponents
          labelWidth="auto"
          
          className="@container grid flex-grow gap-6 rounded-lg p-5 @4xl:p-7"
          trigger={
            <Button>
              Save
            </Button>
          }
          onFinish={async (values: any) => {
            onSubmit(values);
          }}
          submitter={{
            // Configure the button text
          // Configure the properties of the button
            submitButtonProps: {
              type: 'default',
            },
          }}
          form={form}>
          <ProCard style={{ marginBottom: '6px' }}>
              <div className="mb-10 grid gap-7 @2xl:gap-9 @3xl:gap-11">
                <ProFormText
                  label="Title"
                  name='title'
                  required
                  placeholder="Title"
                  className="col-span-full flex-grow"
                  />

                <ProFormText
                  label="Content"
                  required
                  name='content'
                  placeholder="Content"
                  />
                  <InputComponentCreator
                    label="References"
                    resetValues={componentReset}
                    
                    buttonText='Add Reference'
                    name='references'
                    placeholder='Reference' />
                      
                  <InputComponentCreator
                    label="Tags"
                    name='tags'
                    resetValues={componentReset}
                    placeholder="Tag"
                  buttonText='Add Tags' />
              
                  <ProFormUploadButton
                    name="images"
                    title="upload"
                    required
                    label="Images"
                    fieldProps={{
                      name: 'file',}} />
              
                  <ProFormUploadButton
                    name="videos"
                    title="upload"
                    required
                    label="Videos"
                    fieldProps={{
                      name: 'file',
                    }}
              />
              <ProFormSelect
                // style={{ width: 120 }}
                required
                name='category'
                options={[
                  { value: 'news', label: 'News' },
                  { value: 'science', label: 'Science' },
                  { value: 'technology', label: 'Technology' },
                  {value: 'other', label:"Other"}
                ]}
              />
              </div>
          </ProCard>
        </FormComponents>
      </div>
    </div>
  );
}

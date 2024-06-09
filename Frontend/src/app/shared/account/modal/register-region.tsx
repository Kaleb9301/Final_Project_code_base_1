import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SubmitHandler } from 'react-hook-form';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { Text, Title } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import {
  addRegionInput,
  AddRegionSchema,
} from '@/utils/validators/add-region-schema';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import http from '@/utils/http';
import { Select } from 'rizzui';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddRegionModalView({ id }: { id?: string }) {

  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const createRegionMutation = useMutation( async (data: any) => {
    const response = await http.post("/regions/create/", { ...data })
    
      if (response?.status === 201) {
        toast.success(
           <Text as="b" className="font-semibold">
             Region Registered successfully!
           </Text>
         );

        setLoading(true);
        closeModal();
        setTimeout(() => {
          setLoading(false);
          console.log(' data ->', data);
          setReset({
            region_name: '',
            station: '',
            latitude: '',
            longitude: ''
          });
        }, 600);   
      }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('regions');
    },
  });

  
  const fetchRegionData = async () => {
    try {
      if (id) {
        const response = await http.get(`/regions/${id}/`);
        if (response.status === 200) {
          const result = await response.data;
          return result;
        }
        
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const { data: region_data } = useQuery('region', () => fetchRegionData());

  const onSubmit: SubmitHandler<any> = async(data) => {
    try {
      createRegionMutation.mutate(data);

    } catch(error) {
      // catch-error
      console.log(error)
    }

  };

  return (
    <div className="m-auto p-6">
      <Title as="h3" className="mb-6 text-lg">
        Add New Region
      </Title>
      <Form<any>
        validationSchema={addRegionInput}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
        mode: 'onChange',
        defaultValues: {
          ...region_data
          },
        }}>
        {({ register, control, formState: { errors } }) => (
          <>
            <DataForm control={control} register={register} errors={errors} />
            <div className="mt-8 flex justify-end gap-3">
              <Button
                className="w-auto"
                variant="outline"
                onClick={() => { setReset({}); closeModal()}}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading} className="w-auto">
                Register
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}

export function DataForm({ register, errors }: any) {

  return (
    <div className="flex flex-col gap-4 text-gray-700">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center">
        <Input
          type="text"
          label="Region Name"
          placeholder="region name"
          labelClassName="text-sm font-medium text-gray-900"
          {...register('region_name')}
          error={errors?.region_name?.message}
          className="flex-grow"
        />
        <Input
          type="text"
          label="Station"
          placeholder="station"
          labelClassName="text-sm font-medium text-gray-900"
          {...register('station')}
          error={errors?.station?.message}
          className="flex-grow"
        />
      </div>
        <Input
          type="text"
          label="Latitude"
          placeholder="latitude"
          labelClassName="text-sm font-medium text-gray-900"
          {...register('latitude')}
          error={errors?.latitude?.message}
          className="flex-grow"
        />
        <Input
          type="text"
          label="longitude"
          labelClassName="text-sm font-medium text-gray-900"
          placeholder="longitude"
          {...register('longitude')}
          error={errors?.longitude?.message}
        />
    </div>
  );
}

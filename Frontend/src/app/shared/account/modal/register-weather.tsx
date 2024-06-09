import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SubmitHandler } from 'react-hook-form';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { Text, Title } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import http from '@/utils/http';
import { Select } from '@/components/ui/select';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from '@/config/routes';

let region: any = null;

export default function AddWeatherView() {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams()
  const navigate  = useNavigate();

  const fetchWeather = async () => {
    try {
      if (id) {
        const response = await http.get(`/weather_data/${id}`);
        if (response.status === 200) {
          const result = await response.data;
          return result;
        }
        
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const { data: weather_data } = useQuery('weather', () => fetchWeather());

  console.log({weather_data})

  const createWeatherMutation = useMutation(async (data: any) => {
    if (id) {
        const response = await http.put(`/weather_data/${id}/update/`, { ...data, region })
      
        if (response?.status === 200) {
          toast.success(
            <Text as="b" className="font-semibold">
              Weather Updated successfully!
            </Text>
          );

          setLoading(true);
          closeModal();
          setTimeout(() => {
            setLoading(false);
            console.log(' data ->', data);
            setReset({
              plate_number: '',
              model: '',
              image: null
            });
          }, 600);   
        
         navigate(routes?.weather)
        }
    } else {
        const response = await http.post("/weather_data/create/", {...data, region})
        if (response?.status === 201) {
          toast.success(
            <Text as="b" className="font-semibold">
              Weather Registered successfully!
            </Text>
          );

          setLoading(true);
          closeModal();
          setTimeout(() => {
            setLoading(false);
            console.log(' data ->', data);
            setReset({
              plate_number: '',
              model: '',
              image: null
            });
          }, 600);  
         navigate(routes?.weather)
        }
    }

  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('weather');
    },
  });


  const onSubmit: SubmitHandler<any> = async(data) => {
    try {
      createWeatherMutation.mutate(data);

    } catch(error) {
      // catch-error
      console.log(error)
    }

  };

  return (
    <div className="m-auto p-6">
      <Title as="h3" className="mb-6 text-lg">
        {id? 'Edit Weather Data':'Add New Weather'}
      </Title>
      <Form<any>
        // validationSchema={}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
        mode: 'onChange',
        defaultValues: {
          weather_data
          },
        }}
      >
        {({ register, control, formState: { errors } }) => (
          <>
            <WeatherForm weather_data={weather_data} id={id} control={control} register={register} errors={errors} />
            <div className="mt-8 flex justify-end gap-3">
              <Button
                className="w-auto"
                variant="outline"
                onClick={() => closeModal()}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading} className="w-auto">
                {id? 'Edit':'Add'}
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}

export function WeatherForm({ register, errors, weather_data }: any) {
  const [value, setValue] = useState(null as any);
  const assignRegion = (selectedOption: any) => {
    region = selectedOption ? selectedOption?.value : null;
    setValue(selectedOption)
  }

  const fetchRegionData = async () => {
    try {
      const response = await http.get(`/regions`);
      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  
  
function renderDisplayValue(value: any) {
  return (
    <span className="flex items-center gap-2">
      <Text>{value.label}</Text>
    </span>
  )
}

function renderOptionDisplayValue(option: any) {
  return (
    <div className="flex items-center gap-3">
      <div>
        <Text fontWeight="medium">{option.label}</Text>
        <Text>{option.value}</Text>
      </div>
    </div>
  )
}
  const { data, isLoading, isError } = useQuery(['regions'], () => fetchRegionData());

  const optionsList = data && data?.map((value: any) => ({
    label: value?.region_name,
    value: value?.id,
  }));


  return (
    <div className="flex flex-col gap-4 text-gray-700">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center">
        <Input
          type="date"
          label="Date"
          placeholder="Plate Number"
          labelClassName="text-sm font-medium text-gray-900"
          defaultValue={weather_data?.date}
          {...register('date')}
          error={errors?.date?.message}
          className="flex-grow"
        />
      </div>
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center">
        <Input
          type="number"
          label="Min Tempreture"
          placeholder="min tempreture"
          defaultValue={weather_data?.min_temprature}
          labelClassName="text-sm font-medium text-gray-900"
          {...register('min_temprature')}
          error={errors?.min_temprature?.message}
          className="flex-grow"
        />
        <Input
          type="number"
          label="Max Tempreture"
          placeholder="max tempreture"
          defaultValue={weather_data?.max_temprature}
          labelClassName="text-sm font-medium text-gray-900"
          {...register('max_temprature')}
          error={errors?.max_temprature?.message}
          className="flex-grow"
        />
      </div>
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center">
        <Input
          type="text"
          label="Rain RH 1"
          placeholder="Rain Humidity 1"
          defaultValue={weather_data?.relative_humidity_1}
          labelClassName="text-sm font-medium text-gray-900"
          {...register('relative_humidity_1')}
          error={errors?.relative_humidity_1?.message}
          className="flex-grow"
        />
        <Input
            type="text"
            label="Rain RH 2"
            placeholder="relative_humidity_2"
            defaultValue={weather_data?.relative_humidity_2}
            labelClassName="text-sm font-medium text-gray-900"
            {...register('relative_humidity_2')}
            error={errors?.relative_humidity_2?.message}
            className="flex-grow"
          />
      </div>
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center">
        <Input
            type="text"
            label="Wind"
            placeholder="wind"
            defaultValue={weather_data?.wind}
            labelClassName="text-sm font-medium text-gray-900"
            {...register('wind')}
            error={errors?.wind?.message}
            className="flex-grow"
        />
        <Input
          type="text"
          label="Rain"
          placeholder="rain"
          labelClassName="text-sm font-medium text-gray-900"
          {...register('rain')}
          defaultValue={weather_data?.rain}
          error={errors?.rain?.message}
          className="flex-grow"
        />
      </div>
      <Input
          type="text"
          label="Evaporation"
          placeholder="evaporation"
          defaultValue={weather_data?.evaporation}
          labelClassName="text-sm font-medium text-gray-900"
          {...register('evaporation')}
          error={errors?.evaporation?.message}
          className="flex-grow"
        />
      <Input
          type="text"
          label="Cumulative Rain"
          placeholder="cumilative rain"
          labelClassName="text-sm font-medium text-gray-900"
          defaultValue={weather_data?.cumilative_rain}
          {...register('cumilative_rain')}
          error={errors?.cumilative_rain?.message}
          className="flex-grow"
      />
      <Input
          type="text"
          label="Radiation"
          placeholder="radiation"
          labelClassName="text-sm font-medium text-gray-900"
          {...register('radiation')}
          defaultValue={weather_data?.radiation}
          error={errors?.radiation?.message}
          className="flex-grow"
      />
        <Select
          label="Select Region"
          {...register('region')}
          defaultValue={weather_data?.region}
          options={data && optionsList}
          value={value}
          onChange={(selectedOption: any) => assignRegion(selectedOption)}
          displayValue={(value) => renderDisplayValue(value)}
          getOptionDisplayValue={(option) => renderOptionDisplayValue(option)}
        />
    </div>
  );
}

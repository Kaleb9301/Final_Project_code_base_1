import { Button } from '@/components/ui/button';
import HorizontalFormBlockWrapper from '@/app/shared/account/horiozontal-block';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { PiPlusBold, PiUpload } from 'react-icons/pi';
import ListingTable from '@/app/shared/table/listing-table/weather-table';
// import AddWeather from '@/app/shared/account/modal/register-car';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/config/routes';
import { Upload } from "antd";
import { fileHttp } from '@/utils/http';
import { ProFormUploadButton } from '@ant-design/pro-components';
import { uploadFiles } from '@/utils/uploadthing';
import { use, useState } from 'react';
import toast from 'react-hot-toast';
import useAuth from '@/hooks/use-auth';

export default function AcccountSettingsView() {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const { auth } = useAuth();


  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file[0]);

    const response = await fileHttp?.post("/weather_data/upload/", formData)
    console.log({status: response?.status})
  }

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fileHttp.post('/weather_data/upload/', formData);
      if (response.status === 201) {
        toast.success("file uploaded successfully");
        queryClient.invalidateQueries("weather");
      }

      setMessage(response.data.message);
    } catch (error) {
      // console.log(error)
    }
  };
  return (
    <div className="@container">
      <HorizontalFormBlockWrapper
        childrenWrapperClassName="gap-0 @lg:gap-0"
        title="Weather"
        description="Manage Weather Data"
        titleClassName="text-xl font-semibold"
      >
{ auth?.role === "admin" &&  <div className="col-span-2 flex justify-end gap-2">

          <Button
            type="button"
            onClick={() =>
             navigate(routes.register_weather)
            }
          >
            <PiPlusBold className="me-1.5 h-4 w-4" />
            Record Weather
          </Button>
          <form onSubmit={handleSubmit}>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <Button type="submit">Upload</Button>
          </form>

        </div>}
      </HorizontalFormBlockWrapper>
      <ListingTable />
    </div>
  );
}

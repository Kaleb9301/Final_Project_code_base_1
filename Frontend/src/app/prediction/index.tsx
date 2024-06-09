import { Button } from '@/components/ui/button';
import HorizontalFormBlockWrapper from '@/app/shared/account/horiozontal-block';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { PiExportBold } from 'react-icons/pi';
import ListingTable from '@/app/shared/table/listing-table/prediction-table';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/config/routes';
import { Input, Select } from 'rizzui';
import { useState } from 'react';
import { Text, Title } from '@/components/ui/text';
import http from '@/utils/http';


export default function AcccountSettingsView() {
  const { openModal } = useModal();
  const [value, setValue] = useState<any>(null);
  const [dateValue, setDateValue] = useState<any>();
  const [endDate, setEndDateValue] = useState<any>();
  const [region, setRegion] = useState<any>();

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


  return (
    <div className="@container">
      <HorizontalFormBlockWrapper
        childrenWrapperClassName="gap-0 @lg:gap-0"
        title="Prediction"
        description="View Prediction Data"
        titleClassName="text-xl font-semibold">
        <div className="col-span-2 flex justify-end gap-4">

          {/* <Button
            type="button"
            onClick={() =>
             null
            }
          >
            <PiExportBold className="me-1.5 h-4 w-4" />
            Export Table
          </Button> */}
        </div>
      </HorizontalFormBlockWrapper>
      <ListingTable />
    </div>
  );
}

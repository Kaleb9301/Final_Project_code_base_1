import { Button } from '@/components/ui/button';
import HorizontalFormBlockWrapper from '@/app/shared/account/horiozontal-block'

import AddRegion from '@/app/shared/account/modal/register-region';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { PiPlusBold } from 'react-icons/pi';
import ListingTable from '@/app/shared/table/listing-table/region-table';
import { useQuery } from 'react-query';
import useAuth from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';


export default function AcccountSettingsView(){
  const { openModal } = useModal();
  const { auth } = useAuth();

  return (
    <div className="@container">
      <HorizontalFormBlockWrapper
        childrenWrapperClassName="gap-0 @lg:gap-0"
        title="Region Data"
        description="Manage Region Records."
        titleClassName="text-xl font-semibold"
      >

        <div className="col-span-2 flex justify-end gap-4">
          { auth.role === "admin" &&
          <Button
            type="button"
            onClick={() =>
              openModal({
                view: <AddRegion/>,
              })
            }>
            <PiPlusBold className="me-1.5 h-4 w-4" />
            Insert Data
          </Button>
          }
        </div>
      </HorizontalFormBlockWrapper>
      <ListingTable />
    </div>
  );
}

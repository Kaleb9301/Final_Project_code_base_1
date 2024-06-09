import { Title } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import HorizontalFormBlockWrapper from '@/app/account/horiozontal-block';
import { Avatar } from '@/components/ui/avatar';
import http from '@/utils/http';
import { useQuery } from 'react-query';


const fetchAdmins = async() => {
  try {
      const response = await http?.get("/auth/admins/");
      return response?.data;
  } catch (error) {
      console.log(error);
  }
  
}

export default function TeamSettingsView() {

  const { data: currentActiveAdmins } = useQuery('admins', () => fetchAdmins())
  console.log({ currentActiveAdmins });

  return (
    <div className="@container">
      <HorizontalFormBlockWrapper
        className="pb-0 sm:pb-10"
        childrenWrapperClassName="gap-0 @lg:gap-0"
        title="Registered Admins"
        description="you have currently these registered admins."
      >
        {currentActiveAdmins?.map((currentAdmin: any, index: number) => {
          return (
            <div
              key={`admin-${index}`}
              className="col-span-2 flex items-center gap-3 border-b border-muted py-6 last:border-none"
            >
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-muted">
                <Avatar name={currentAdmin?.first_name}/>
              </div>
              <div className="flex flex-grow flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Title as="h3" className="mb-1 text-sm font-semibold">
                    {currentAdmin.first_name+ ' '+currentAdmin.last_name}
                  </Title>
                </div>
                
                  <Button
                    type="button"
                    disabled
                    className="w-auto  justify-start text-sm font-semibold sm:justify-center">
                    Freeze
                  </Button>
                
              </div>
            </div>
          );
        })}
      </HorizontalFormBlockWrapper>
    </div>
  );
}

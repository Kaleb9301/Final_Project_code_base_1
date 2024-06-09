import { Title } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import HorizontalFormBlockWrapper from '@/app/account/horiozontal-block';
import { Avatar } from '@/components/ui/avatar';


export default function TeamSettingsView() {
  return (
    <div className="@container">
      <HorizontalFormBlockWrapper
        className="pb-0 sm:pb-10"
        childrenWrapperClassName="gap-0 @lg:gap-0"
        title="Notifications"
        description="Manage your notifications here"
      >
      </HorizontalFormBlockWrapper>
    </div>
  );
}

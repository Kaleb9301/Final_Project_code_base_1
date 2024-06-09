import ProfileSettingsNav from '@/app/shared/account/navigation';
import { Outlet } from 'react-router-dom';

export default function ProfileSettingsFormPage() {

  return (
    <>   
      <ProfileSettingsNav />
      <Outlet/>
    </>
  );
}

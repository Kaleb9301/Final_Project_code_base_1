import ProfileSettingsNav from '@/app/shared/account/navigation';
import PasswordSettingsView from '@/app/shared/account/password-settings';



export default function ProfileSettingsFormPage() {

  return (
    <>   
      <PasswordSettingsView
        settings={{
          newPassword: '',
          confirmedPassword: '',
        }}
      />
    </>
  );
}

import { routes } from '@/config/routes';
import { Button } from '@/components/ui/button';
import WelcomeBanner from '@/components/banners/welcome';
import StatCards from './stat-cards';
import { PiGearBold } from 'react-icons/pi';
// import welcomeImg from '@/public/welcome-laptop.png';
import HandWaveIcon from '@/components/icons/hand-wave';
import useAuth from '@/hooks/use-auth';
import http from '@/utils/http';
import { useQuery } from 'react-query';

export default function Dashboard() {

  const auth = useAuth();
  const user = { ...auth?.auth }
  
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
        <WelcomeBanner
          title={
            <>
              Hello, <br /> { user.username }{' '}
              <HandWaveIcon className="inline-flex h-8 w-8" />
            </>
          }
          description={
            ' A dought prediction site'
          }
          media={
            <div className="absolute -bottom-6 end-4 hidden w-[300px] @2xl:block lg:w-[320px] 2xl:-bottom-7 2xl:w-[330px]">
              <div className="relative">
                {/* <img
                  // src={welcomeImg}
                  alt="Welcome shop image form freepik"
                  className="dark:brightness-95 dark:drop-shadow-md"
                /> */}
              </div>
            </div>
          }
          contentClassName="@2xl:max-w-[calc(100%-340px)]"
          className="border border-muted bg-gray-0 pb-8 @4xl:col-span-2 @7xl:col-span-8 lg:pb-9 dark:bg-gray-100/30">
          {/* {
            user?.role === "admin" &&
            <a href={routes.account.profile} className="inline-flex">
              <Button
                as="span"
                className="h-[38px] shadow md:h-10 dark:bg-gray-100 dark:text-gray-900"
              >
                <PiGearBold className="me-1 h-4 w-4" /> Manage
              </Button>
            </a>
           } */}
        </WelcomeBanner>
         {user?.role === ("staff" || "regular") &&
        <WelcomeBanner
          title={
            <>
            
            </>
          }
          description={
            ' A dought prediction site'
          }
          media={
            <div className="absolute -bottom-6 end-4 hidden w-[300px] @2xl:block lg:w-[320px] 2xl:-bottom-7 2xl:w-[330px]">
              <div className="relative">
                {/* <img
                  // src={welcomeImg}
                  alt="Welcome shop image form freepik"
                  className="dark:brightness-95 dark:drop-shadow-md"
                /> */}
              </div>
            </div>
          }
          contentClassName="@2xl:max-w-[calc(100%-340px)]"
          className="border border-muted bg-gray-0 pb-8 @4xl:col-span-2 @7xl:col-span-8 lg:pb-9 dark:bg-gray-100/30">
          {/* {
            user?.role === "admin" &&
            <a href={routes.account.profile} className="inline-flex">
              <Button
                as="span"
                className="h-[38px] shadow md:h-10 dark:bg-gray-100 dark:text-gray-900"
              >
                <PiGearBold className="me-1 h-4 w-4" /> Manage
              </Button>
            </a>
           } */}
        </WelcomeBanner> }
        {user?.role === "admin" && <StatCards className="@2xl:grid-cols-3 @3xl:gap-6 @4xl:col-span-2 @7xl:col-span-8" />}
        {/* <RecentOrder className="relative @4xl:col-span-2 @7xl:col-span-12" /> */}
      </div>
    </div>
  );
}

import { LAYOUT_OPTIONS } from '@/config/enums';
import { useLayout } from '@/hooks/use-layout';
import { useIsMounted } from '@/hooks/use-is-mounted';
import SideLayout from '@/layouts/side-nav/layout';
import TopLayout from '@/layouts/top-nav/lithium-layout';
import { Outlet } from 'react-router-dom';
import GlobalModal from './shared/modal-views/container';
import GlobalDrawer from './shared/drawer-views/container';
import { Toaster } from 'react-hot-toast';

export default function DefaultLayout() {
  const { layout } = useLayout();
  const isMounted = useIsMounted();

  // if (!session) router.push('/api/auth/sigin');

  if (!isMounted) {
    return null;
  }

  if (layout === LAYOUT_OPTIONS.SIDENAV) {
    return (
      <SideLayout>
        <Outlet />
        <GlobalModal />
        <GlobalDrawer />
        <Toaster/>
      </SideLayout>);
  }
  if (layout === LAYOUT_OPTIONS.TOPNAV) {
    return (
      <TopLayout>
        <Outlet />
        <GlobalModal />
        <GlobalDrawer />
        <Toaster/>
      </TopLayout>
    );
  }
  return (
    <SideLayout>
      <Outlet />
      <GlobalModal />
      <GlobalDrawer/>
    </SideLayout>
  );
}

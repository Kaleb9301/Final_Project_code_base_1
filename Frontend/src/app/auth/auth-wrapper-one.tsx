import cn from '@/utils/class-names';
import { Title } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';

function AuthNavLink({
  href,
  children,
}: React.PropsWithChildren<{
  href: string;
}>) {
  const location = useLocation();
  const pathname = location.pathname;

  function isActive(href: string) {
    if (pathname === href) {
      return true;
    }
    return false;
  }

  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center gap-x-1 rounded-3xl p-2 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 md:px-4 md:py-2.5 [&>svg]:w-4 [&>svg]:text-gray-500',
        isActive(href) ? 'bg-gray-100 text-gray-900 [&>svg]:text-gray-900' : ' '
      )}
    >
      {children}
    </a>
  );
}

export default function AuthWrapper({
  children,
  title,
  isSocialLoginActive = false,
  isSignIn = false,
  className = '',
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  isSocialLoginActive?: boolean;
  isSignIn?: boolean;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col justify-between">
      {/* <AuthHeader /> */}

      <div className="flex w-full flex-col justify-center px-5">
        <div
          className={cn(
            'mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-xl 2xl:pb-8 2xl:pt-2',
            className
          )}
        >
          <div className="flex flex-col items-center">
            <Title
              as="h2"
              className="mb-7 text-center text-[28px] font-bold leading-snug md:text-3xl md:!leading-normal lg:mb-10 lg:text-4xl"
            >
              {title}
            </Title>
          </div>
          {isSocialLoginActive && (
            <>
              <div className="flex flex-col gap-4 pb-6 md:flex-row md:gap-6 xl:pb-7">
                <Button variant="outline" className="h-11 w-full">
                  <FcGoogle className="me-2 h-4 w-4 shrink-0" />
                  <span className="truncate">Signin with Google</span>
                </Button>
                <Button variant="outline" className="h-11 w-full">
                  <BsFacebook className="me-2 h-4 w-4 shrink-0 md:h-5 md:w-5" />
                  <span className="truncate">Signin with Facebook</span>
                </Button>
              </div>
            </>
          )}

          {children}
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}


function AuthFooter() {
  return (
    <footer className="flex flex-col-reverse items-center justify-between px-4 py-5 lg:flex-row lg:px-16 lg:py-6 2xl:px-24 2xl:py-10">
      <div className="text-center leading-relaxed text-gray-500 lg:text-start">
        © Copyright 2024. Drought Prediction{' '}
        <a
          href="#"
          className="font-medium transition-colors hover:text-primary"
        >
          {/* Robera Endale */}
        </a>
      </div>
    </footer>
  );
}

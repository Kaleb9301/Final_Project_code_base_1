import { Text, Title } from '@/components/ui/text';
import { PiLockKeyOpenLight } from "react-icons/pi";

import cn from '@/utils/class-names';
import { Avatar, Switch } from 'rizzui';


export function ProfileHeader({
  title,
  description,
  children,
}: React.PropsWithChildren<{ title: string; description?: string }>) {

  return (
    <div
      className={cn(
        'relative z-0 -mx-4 px-4 pt-28 before:absolute before:start-0 before:top-0 before:h-20 before:w-full before:bg-gradient-to-r before:from-[#F8E1AF] before:to-[#F6CFCF] @3xl:pt-[150px] @3xl:before:h-[calc(100%-120px)] md:-mx-5 md:px-5 lg:-mx-8 lg:px-8 xl:-mx-6 xl:px-6 3xl:-mx-[33px] 3xl:px-[33px] 4xl:-mx-10 4xl:px-10 dark:before:from-[#bca981] dark:before:to-[#cbb4b4]',
        'xl:before:w-[calc(100%_+_10px)]'
      )}
  >
      <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-wrap items-end justify-start gap-6 border-b border-dashed border-muted pb-10">
        <div>
          <Title
            as="h2"
            className="mb-2 inline-flex items-center gap-3 text-xl font-bold text-gray-900"
          >
            {title}
            <PiLockKeyOpenLight  className="h-5 w-5 text-primary md:h-6 md:w-6" />
          </Title>
          {description ? (
            <Text className="text-sm text-gray-500">{description}</Text>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
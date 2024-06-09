import React from 'react'
import { Button } from '@/components/ui/button';
import { Title, Text } from '@/components/ui/text';

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] dark:bg-gray-50">
      <div className=" grid gap-20 3xl:gap-8">
        <div className="flex grow items-center px-6 xl:px-10">
          <div className="mx-auto flex w-full max-w-[1180px] flex-col-reverse items-center justify-between text-center lg:flex-row lg:gap-5 lg:text-start 3xl:max-w-[1520px]">
              <div>
                <Title
                  as="h2"
                  className="mb-3 text-[22px] font-bold leading-snug sm:text-2xl md:mb-5 md:text-3xl md:leading-snug xl:mb-7 xl:text-4xl xl:leading-normal 2xl:text-[40px] 3xl:text-5xl 3xl:leading-snug"
                >
                  Welcome to Drought Prediction Site <br />

                </Title>
                <Text className="mb-6 max-w-[712px] text-sm leading-loose text-gray-500 md:mb-8 xl:mb-10 xl:text-base xl:leading-loose">
                  Welcome to our Drought Prediction site. Stay informed about current drought conditions, access historical data, and benefit from predictive models. <br className="hidden sm:inline-block lg:hidden" />
                  Prepare for potential drought events and discover strategies for resilience. Join us in building a more resilient future.
                </Text>
                <div className="mt-8 flex flex-col justify-center gap-4 lg:flex-row lg:justify-start xl:gap-6">
                  <Button
                    color="primary"
                    size="lg"
                    className="h-12 px-4 xl:h-14 xl:px-6"
                  >
                      Explore
                  </Button>
                </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage;

import MetricCard from '@/components/cards/metric-card';
import TagIcon from '@/components/icons/user-color';
import cn from '@/utils/class-names';
import http from '@/utils/http';
import { FaDatabase } from "react-icons/fa";
import { useQuery } from 'react-query';

export default function StatCards({ className }: { className?: string }) {

  const fetchData = async () => {
      try {
        const response = await http.get(`/auth/dashboard_data`);
          if (response.status === 200) {
            const result = await response.data;
            return result;
          }
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };


  const { data, isLoading, isError } = useQuery(['dashboard'], () => fetchData());

  return (
    <div
      className={cn('grid grid-cols-1 gap-5 3xl:gap-8 4xl:gap-9', className)}
    >
        <MetricCard
          key="Total Users"
          title="Total Users"
          metric={data?.total_regions}
          icon={ <TagIcon className="h-full w-full" />}
          iconClassName="bg-transparent w-11 h-11" />
        
        <MetricCard
          key="Total Weather"
          title="Toatal Records"
          metric={data?.total_weather_data }
          icon={ <FaDatabase className="h-full w-full" />}
          iconClassName="bg-transparent w-11 h-11" />

        <MetricCard
          key="Total Regions"
          title="Toatal Regions"
          metric={data?.total_regions}
          icon={ <FaDatabase className="h-full w-full" />}
          iconClassName="bg-transparent w-11 h-11" />
    </div>
  );
}

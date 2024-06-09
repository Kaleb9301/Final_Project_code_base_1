import DateCell from '@/components/ui/date-cell';
import useAuth from '@/hooks/use-auth';
import http from '@/utils/http';
import {
  ActionType,
  ProColumns,
  ProTable
} from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useModal } from '../../modal-views/use-modal';
import { Button } from 'rizzui';
import { FaFilter } from 'react-icons/fa';
import { Input, Select } from 'rizzui';
import { Text, Title } from '@/components/ui/text';
import { PiExportBold } from 'react-icons/pi';
import React from 'react';
import { DatePicker }  from '@/components/ui/datepicker';
import { filter } from 'lodash';


export default function ListingTable() {
  const queryClient = useQueryClient();
  const actionRef = useRef<ActionType>();
  const { openModal } = useModal();
  const [pageNumber, setPageNumber] = useState(1);
  const [rowData, setRowData] = useState<any>({});
    const [value, setValue] = useState<any>(null);
  const [dateValue, setDateValue] = useState<any>();

  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDateValue] = useState<any>();
  const [region, setRegion] = useState<any>();
  const [predictState, setPredictState] = useState<Boolean>(false);

  const fetchRegionData = async () => {
    try {
      const response = await http.get(`/regions`);
      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



function renderDisplayValue(value: any) {
  return (
    <span className="flex items-center gap-2">
      <Text>{value.label}</Text>
    </span>
  )
}

function renderOptionDisplayValue(option: any) {
  return (
    <div className="flex items-center gap-3">
      <div>
        <Text fontWeight="medium">{option.label}</Text>
        <Text>{option.value}</Text>
      </div>
    </div>
  )
}
  const { data: regionData, isError } = useQuery(['regions'], () => fetchRegionData());
  const { auth } = useAuth();

  const fetchData = async () => {
    try {
      if (true && value && endDate && startDate) {
        const response = await http.get(`/weather_data/predict?region=${value?.value}&ed=${endDate}&sd=${startDate}`);    
        console.log(response?.data)
        if (response.status === 200) {
          const result = await response.data;
          console.log(result);
          setPredictState(false)
          return result;
        }
      }
    } catch (error) {
    console.error('Error fetching data:', error);
    }
  };
  
  
  const { data, isLoading } = useQuery(['prediction', pageNumber, dateValue, endDate], () => fetchData());

    const optionsList = regionData && regionData?.map((value: any) => ({
      label: value?.region_name,
      value: value?.id,
    }));
  
  const columns: ProColumns[] = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: false,
      align: 'center',
      ellipsis: true,
      render: (_, row: any) => <DateCell date={row.date} />,
    },
    {
      title: 'Max Tempreture',
      dataIndex: 'max_temprature',
      sorter: false,
      align: 'start',
      ellipsis: true,
    },
    {
      title: 'Rain',
      dataIndex: 'rain',
      key: 'rain',
      sorter: false,
      align: 'start',
      ellipsis: true,
    },
    {
      title: 'Rain RH 1',
      dataIndex: 'rh2',
      key: 'relative_humidity_1',
      sorter: false,
      align: 'start',
      ellipsis: true,
    },
    {
      title: 'Rain RH 2',
      dataIndex: 'rh2',
      key: 'relative_humidity_2',
      sorter: false,
      align: 'start',
      ellipsis: true,
    },
    {
      title: 'Wind',
      dataIndex: 'wind',
      key: 'wind',
      sorter: false,
      align: 'start',
      ellipsis: true,
    },
    {
      title: 'Station',
      dataIndex: 'station',
      key: 'station',
      sorter: false,
      align: 'start',
      ellipsis: true,
    },
    {
      title: 'Evaporation',
      dataIndex: 'evaporation',
      key: 'evaporation',
      sorter: false,
      align: 'start',
      ellipsis: true,
    },
    {
      title: 'Cumulative Rain',
      dataIndex: 'cum_rain',
      key: 'cumulative_rain',
      sorter: false,
      align: 'start',
      ellipsis: true,
    },
    {
      title: 'Radiation',
      dataIndex: 'radiation',
      key: 'radiation',
      sorter: false,
      align: 'start',
      ellipsis: true,
    },
    {
      title: 'SPI_Index',
      dataIndex: 'spei',
      key: 'spei',
      sorter: false,
      align: 'start',
      ellipsis: true,
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      sorter: false,
      align: 'start',
      ellipsis: true,
    },
  ];

    const [starRangetDate, setStartRangeDate] = React.useState<Date | null>(null);
    const [endRangeDate, setEndRangeDate] = React.useState<Date | null>(null);
    const handleRangeChange = (dates: [Date | null, Date | null]) => {
      const [start, end] = dates;
      console.log({ start, end });

      if (start && end) { 
        setStartDate(new Date(start).toLocaleDateString());
        setEndDateValue(new Date(end).toLocaleDateString());
      }

      setStartRangeDate(start);
      setEndRangeDate(end);
    };

  const filter = () => {
    setPredictState(true);
  };

  return (
    <>
      <div className='mx-2 flex gap-2'>
          <>
          
            <Select
              name="region"
              options={regionData && optionsList}
              className='w-100'
              value={value}
              onChange={setValue}
              displayValue={(value) => renderDisplayValue(value)}
              getOptionDisplayValue={(option) => renderOptionDisplayValue(option)}
            />
            <DatePicker
              selected={starRangetDate}
              onChange={handleRangeChange}
              startDate={starRangetDate}
              endDate={endRangeDate}
              monthsShown={2}
              placeholderText="Select Date in a Range"
              selectsRange
              inputProps={{
                clearable: true,
                onClear: () => {
                  setStartRangeDate(null);
                  setEndRangeDate(null);
                },
              }}
              />
            <Button
              type="button"
              onClick={() =>
                filter()
              }
            >
              Predict
            </Button>
          </>
        
      </div>
      <ProTable
        columns={columns}
        cardBordered={false}
        loading={false}
        bordered={false}
        showSorterTooltip={false}
        scroll={{ x: true }}
        tableLayout={'fixed'}
        rowSelection={false}
        search={false}
        actionRef={actionRef}
        dataSource={data?.data}
        // dateFormatter="string"
        rowKey="weather"
        // pagination={{
        //   total: data?.total_items,
        //   current: data?.current_page,
        // showQuickJumper: true,
        // pageSize: 10,
        //   onChange: (page) => {
        //     setPageNumber(page);
        //   },
        // }}
        toolbar={{
          // search: {
          //     onSearch: (value: string) => {
          //     //   handleSearch(value);
          //     },
          // },
        }}
        toolBarRender={() => [
          <div>
            Average SPI: {data?.avrage_spi}
            { }
          </div>
          // <Button
          //   key="button"
          //   icon={<PlusOutlined />}
          //   onClick={() => {
          //     displayColorModal();
          //   }}
          //   type="default"
          // >
          //   Color
          // </Button>,
          // <Button
          //   key="button"
          //   icon={<FaFilter />}
          //   onClick={() => {
                
          //   }}>Filter
          //   </Button>,
            ]}
            options={false}/>
       </>
  );
}

import DateCell from '@/components/ui/date-cell';
import useAuth from '@/hooks/use-auth';
import http from '@/utils/http';
import {
  ActionType,
  ProColumns,
  ProTable
} from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useModal } from '../../modal-views/use-modal';
import ButtonGroup from 'antd/es/button/button-group';
import { Button } from 'antd';
import { FaEdit } from 'react-icons/fa';
import { PiTrash } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/config/routes';
import toast from 'react-hot-toast';


export default function ListingTable({ id }: { id?: string; }) {
  const queryClient = useQueryClient();
  const actionRef = useRef<ActionType>();
  const { openModal } = useModal();
  const [pageNumber, setPageNumber] = useState(1);
  const [rowData, setRowData] = useState<any>({})
  const { auth } = useAuth();
  const navigate = useNavigate()
  
  const fetchData = async (pageNumber: number) => {
    try {
      const response = await http.get(`/weather_data/?page=${pageNumber}`);
      if (response.status === 200) {
        const result = await response?.data;
        console.log({data: response?.data})
          return result;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const deleteWeatherMutation = useMutation(async (data: any) => {
    if (confirm("Are you sure, do you want to delete the data?")) {
      const response = await http.delete(`/weather_data/${data?.id}/delete`)
      if (response?.status === 204) {
      toast.success("Weather Deleted successfully!");
    }
    } else {
      toast.error("request cancelled!");

    }
   
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('weather');
    },
  });

  

  const { data, isLoading: isDataLoading} = useQuery(['weather', pageNumber], () => fetchData(pageNumber));

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
      title: 'Min Temprature',
      dataIndex: 'min_temprature',
      key: 'min_temprature',
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
      dataIndex: 'relative_humidity_1',
      key: 'relative_humidity_1',
      sorter: false,
      align: 'start',
      ellipsis: true,
    },
    {
      title: 'Rain RH 2',
      dataIndex: 'relative_humidity_2',
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
      title: 'Evaporation',
      dataIndex: 'evaporation',
      key: 'evaporation',
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
      title: 'Cumilative Rain',
      dataIndex: 'cumilative_rain',
      key: 'cumulative_rain',
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
    {
      title: 'Action',
      align: 'center',
      key: 'option',
      fixed: 'right',
       render: (_, row: any) => (
         <ButtonGroup>
          {  auth?.role === "admin" && <>              
              <Button
                  key="view"
                  shape="round"
                  onClick={() => navigate(routes.edit_weather(row?.id))}
                  icon={<FaEdit style={{ color: 'green' }} />}>
                      Edit
              </Button>
              < Button
                  key="delete"
                  shape="round"
                  onClick={() => deleteWeatherMutation.mutateAsync(row)}
                  icon={<PiTrash style={{ color: 'red' }} />}>
                      Delete
              </Button>
            </>}
        </ButtonGroup>
      ),
    },
  
  ];

  return (
      <>
        <ProTable
            columns={columns}
            cardBordered={false}
            loading={isDataLoading}
            bordered={false}
            showSorterTooltip={false}
            scroll={{ x: true }}
            tableLayout={'fixed'}
            rowSelection={false}
            search={false}
            actionRef={actionRef}
            dataSource={data && data?.results}
            // dateFormatter="string"
            rowKey="weather"
            pagination={{
              total: data?.count,
            showQuickJumper: true,
            pageSize: 10,
              onChange: (page) => {
                setPageNumber(page);
              },
            }}
            toolbar={{
            // search: {
            //     onSearch: (value: string) => {
            //     //   handleSearch(value);
            //     },
            // },
            }}
            toolBarRender={() => [
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
            //     key="button"
            //     icon={<PlusOutlined />}
            //     onClick={() => {
            //     <FilterElement
            //         isFiltered={isFiltered}
            //         filters={filters}
            //         updateFilter={updateFilter}
            //         handleReset={handleReset} />
            //         }}
            //     >
            //     Filter
            // </Button>,
            ]}
            options={false}/>
       </>
  );
}

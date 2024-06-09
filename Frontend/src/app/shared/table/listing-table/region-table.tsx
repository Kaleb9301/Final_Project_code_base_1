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
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../modal-views/use-modal';
import ButtonGroup from 'antd/es/button/button-group';
import { Button } from 'antd';
import { FaEdit, FaUserCheck } from 'react-icons/fa';
import { PiTrash } from 'react-icons/pi';
import { routes } from '@/config/routes';
import AddRegion from '@/app/shared/account/modal/register-region';
import toast from 'react-hot-toast';


const filterState = {
  wallet: ['', ''],
  issued_at: [null, null],
  status: '',
};

export default function ListingTable() {
  const queryClient = useQueryClient();
  const actionRef = useRef<ActionType>();
  const { openModal } = useModal();
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const { auth } = useAuth();

  const fetchData = async (pageNumber: number) => {
    try {
      const response = await http.get('/regions/');
      if (response.status === 200) {
          const result = await response?.data;
          return result;
      }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  const deleteRegionMutation = useMutation(async (data: any) => {
    if (confirm("Are you sure, do you want to delete the data?")) {

      const response = await http.delete(`/regions/${data?.id}/delete`);
      console.log(response?.status)
      if (response?.status === 204) {
        toast.success("Region Deleted successfully!");
      }

    } else {
        toast.error("Request cancelled successfully")
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('regions');
    },
  });



  const { data, isLoading: isDataLoading, isError } = useQuery(['regions', pageNumber], async () => await fetchData(pageNumber));

  const columns: ProColumns[] = [
        {
          title: 'Region Name',
          dataIndex: 'region_name',
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
          title: "latitude",
          dataIndex: 'latitude',
          key: 'lattitude',
          sorter: false,
          align: 'center',
          ellipsis: true,
        },
        {
          title: 'Longitude',
          dataIndex: 'longitude',
          key: 'longitude',
          sorter: false,
          align: 'center',
          ellipsis: true,
      },
      {
          title: 'Created By',
          dataIndex: 'added_by',
          key: 'created_by',
          sorter: false,
          align: 'center',
          ellipsis: true,
    },
    // {
    //       title: 'Created At',
    //       dataIndex: 'created_at',
    //       key: 'created_at',
    //       sorter: false,
    //       align: 'center',
    //       ellipsis: true,
    //       render: (_, row: any) => <DateCell date={row.created_at} />,
    //   },
      {
          title: 'Action',
          align: 'center',
          key: 'option',
          fixed: 'right',
          render: (_, row: any) => (
            <ButtonGroup>
               { auth?.role === "admin" && <>              
                  <Button
                      key="view"
                      shape="round"
                      onClick={(value) => openModal({ view: <AddRegion id={row?.id} /> })}
                      icon={<FaEdit style={{ color: 'green' }} />}>
                          Edit
                  </Button>
                  < Button
                      key="delete"
                      shape="round"
                      onClick={() => deleteRegionMutation.mutateAsync(row)}
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
            loading={isDataLoading}
            cardBordered={false}
            bordered={false}
            showSorterTooltip={false}
            scroll={{ x: true }}
            tableLayout={'fixed'}
            rowSelection={false}
            search={false}
            actionRef={actionRef}
            dataSource={data && data}
            // dateFormatter="string"
            rowKey="region"
            pagination={{
              total: data?.total_items,
              current: data?.current_page,
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

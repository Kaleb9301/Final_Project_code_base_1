import { Title, Text } from '@/components/ui/text';
import { ActionIcon } from '@/components/ui/action-icon';
import { Button as Btn} from 'antd';
import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/popover';
import TrashIcon from '@/components/icons/trash';
import { PiTrashFill } from 'react-icons/pi';
import { FaBan, FaUserCheck } from 'react-icons/fa';

type StatusPopoverProps = {
  title: string;
  is_active?: Boolean;
  description: string;
  onChange: () => void;
};

export default function StatusPopOver({
  title,
  description,
  is_active,
  onChange,
}: StatusPopoverProps) {
  return (

    <Popover placement="left">
      <Popover.Trigger>
        <Btn
          key="active_user"
          shape="round"
          aria-label={'Change Status'}
          className="cursor-pointer hover:!border-gray-900 hover:text-gray-700"
          icon={!is_active? <FaUserCheck  style={{ color: 'green' }} />:<FaBan style={{ color: 'red' }} />}
        >
          {is_active ? 'Ban' : 'Activate'}
        </Btn>
      </Popover.Trigger>
      <Popover.Content>
        {({ setOpen }) => (
          <div className="w-56 pb-2 pt-1 text-left rtl:text-right">
            <Title
              as="h6"
              className="mb-0.5 flex items-start text-sm text-gray-700 sm:items-center"
            >
             {title}
            </Title>
            <Text className="mb-2 leading-relaxed text-gray-500">
              {description}
            </Text>
            <div className="flex items-center justify-end">
              <Button size="sm" className="me-1.5 h-7" onClick={() => { setOpen(false); return onChange() }}>
                Yes
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7"
                onClick={() => setOpen(false)}
              >
                No
              </Button>
            </div>
          </div>
        )}
      </Popover.Content>
    </Popover>

  );
}

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm } from 'antd';
import React, { useCallback, useState } from 'react';
import { deleteTheme } from '../helpers/apiRequests';

interface Props {
    themeId: string;
}

const DeleteModal: React.FunctionComponent<Props> = ({ themeId }) => {
    const [visible, setVisible] = useState(true);

    const onDeleteConfirm = useCallback( async () => {
        await deleteTheme(themeId);
    }, [themeId]);

    const onCancelDelete = useCallback(() => {
        setVisible(false);
    }, []);

    return (
        <Popconfirm title="Are you sure you want to delete this theme?" placement='topRight' onConfirm={onDeleteConfirm} onCancel={onCancelDelete} okText="Confirm" cancelText="Cancel">
            <Button icon={<DeleteOutlined />} />
        </Popconfirm>
    )
}

export default React.memo(DeleteModal);
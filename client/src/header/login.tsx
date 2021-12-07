import React, { useCallback, useMemo, useState } from 'react';
import { Form, Modal, Button, Input } from 'antd';
import 'antd/dist/antd.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const LogInButton: React.FunctionComponent = () => {
    const [visible, setVisible] = useState(false);

    const initialValues = useMemo(() => ({
        email: null,
        password: null
    }), []);

    const showModal = useCallback(() => setVisible(true), []);

    const onModalClose = useCallback(() => setVisible(false), []);

    const renderForm = useCallback(() => (
        <Form name="login" onFinish={() => null} initialValues={initialValues} preserve={false}>
            <Form.Item name="email" rules={[{ required: true, message: "This is a required field." }]} validateTrigger="onBlur">
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder='Username' />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "This is a required field." }]} validateTrigger="onBlur">
                <Input  prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Password' />
            </Form.Item>
        </Form>
    ), [initialValues])

    return ( 
        <>
            <Button onClick={showModal} ghost>Log in</Button>
            <Modal title="Log in" visible={visible} onCancel={onModalClose} destroyOnClose footer={[
                <Button>Log in</Button>
            ]}>
                {renderForm()}
            </Modal>
        </>
    )
}

export default React.memo(LogInButton);
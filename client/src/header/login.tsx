import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Form, Modal, Button, Input } from 'antd';
import 'antd/dist/antd.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { login } from '../helpers/apiRequests'; 
import { getUserData, userContext } from '../helpers/userManagement';

interface FormData {
    email: string;
    password: string;
}

const LogInButton: React.FunctionComponent = () => {
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { userData, setUserData } = useContext(userContext);

    const initialValues = useMemo(() => ({
        email: null,
        password: null
    }), []);

    const validateEmail = useCallback((rule, value: string) => {
        const errMsg = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/.test(value) ? null : 'Invalid email';

        return errMsg ? Promise.reject(errMsg) : Promise.resolve();
    }, []);

    const showModal = useCallback(() => setVisible(true), []);

    const onModalClose = useCallback(() => setVisible(false), []);

    const onFinish = useCallback( async (formData: FormData) => {
        setIsLoading(true);
        return await login(formData.email, formData.password).then(() => {
            const userData = getUserData();
            const reformattedData = userData ? {
                userId: userData[0],
                username: userData[1],
                email: userData[2],
                userRole: userData[3]
            } : {};
            setUserData(
                reformattedData
            )
            setIsLoading(false);
            onModalClose();
        });
    }, [onModalClose, setUserData]);

    const renderForm = useCallback(() => (
        <Form id="login" name="login" onFinish={onFinish} initialValues={initialValues} preserve={false}>
            <Form.Item name="email" rules={[{ required: true, message: "This is a required field." }, { validator: validateEmail }]} validateFirst validateTrigger="onBlur">
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder='E-mail' />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "This is a required field." }]} validateTrigger="onBlur">
                <Input.Password  prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Password' />
            </Form.Item>
        </Form>
    ), [initialValues, onFinish, validateEmail])

    return ( 
        <>
            <Button onClick={showModal} ghost>Log in</Button>
            <Modal title="Log in" visible={visible} onCancel={onModalClose} destroyOnClose footer={[
                <Button loading={isLoading} form="login" key="submit" htmlType='submit'>Log in</Button>
            ]}>
                {renderForm()}
            </Modal>
        </>
    )
}

export default React.memo(LogInButton);
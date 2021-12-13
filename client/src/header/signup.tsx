import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import 'antd/dist/antd.css';
import { useForm } from 'antd/lib/form/Form';
import * as R from 'ramda';
import { register } from '../helpers/apiRequests';
import { getUserData, userContext } from '../helpers/userManagement';

interface FormData {
    username: string;
    email: string;
    password: string;
}

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

const {equals} = R;

const SignUpButton: React.FunctionComponent = () => {
    const [form] = useForm();
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { userData, setUserData } = useContext(userContext);

    const initialValues = useMemo(() => ({
        email: null,
        username: null,
        password: null,
        repeatPassword: null
    }), []);

    const showModal = useCallback(() => setVisible(true), []);

    const onModalClose = useCallback(() => setVisible(false), []);

    const validateEmail = useCallback((rule, value: string) => {
        const errMsg = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/.test(value) ? null : 'Invalid email';

        return errMsg ? Promise.reject(errMsg) : Promise.resolve();
    }, []);

    const validateRepeatPassword = useCallback((rule, value: string) => {
        const controlPassword = form.getFieldValue('password');
        const errMessage = equals(value, controlPassword) ? null : "Password must match.";

        return errMessage ? Promise.reject(errMessage) : Promise.resolve();
    }, [form]);

    const validateUsername = useCallback((rule, value: string) => {
        const errMsg = value.length > 3 && value.length < 10 ? null : "Username must be between 3 and 10 characters.";

        return errMsg ? Promise.reject(errMsg) : Promise.resolve();
    }, []);

    const onFinish = useCallback( async (formData: FormData) => {
        setIsLoading(true);
        return await register(formData).then(() => {
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
        <Form form={form} {...formItemLayout} id="register" name="register" onFinish={onFinish} initialValues={initialValues} preserve={false}>
        <Form.Item label="Username" name="username" rules={[{ required: true, message: "This is a required field." }, {validator: validateUsername}]} validateFirst validateTrigger="onBlur">
            <Input placeholder='Choose a username...' />
        </Form.Item>
        <Form.Item label="E-mail" name="email" rules={[{ required: true, message: "This is a required field." }, { validator: validateEmail }]} validateFirst validateTrigger="onBlur">
            <Input placeholder='E-mail' />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: "This is a required field." }]} validateTrigger="onBlur">
            <Input.Password placeholder='Password' />
        </Form.Item>
        <Form.Item label="Repeat password" name="repeatPassword" rules={[{ required: true, message: "This is a required field." }, {validator: validateRepeatPassword}]} validateFirst validateTrigger="onBlur">
            <Input.Password placeholder='Repeat password' />
        </Form.Item>
    </Form>
    ), [form, initialValues, onFinish, validateEmail, validateRepeatPassword, validateUsername])

    return ( 
        <>
            <Button onClick={showModal} ghost style={{borderColor: 'black'}}>Sign up</Button>
            <Modal title="Register" visible={visible} onCancel={onModalClose} destroyOnClose footer={[
                <Button loading={isLoading} form="register" key="submit" htmlType='submit'>Register</Button>
            ]}>
                {renderForm()}
            </Modal>
        </>
    )
}

export default React.memo(SignUpButton);
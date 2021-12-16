import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { fetchTheme, patchTheme } from "../helpers/apiRequests";

interface Props {
    themeId: string;
}

interface RESPONSE_DATA {
    _id: string;
    name: string;
    userId: string;
}

interface FormValues {
    name: string;
}

const EditModal: React.FunctionComponent<Props> = ({ themeId }) => {
    const [visible, setVisible] = useState(false);
    const [theme, setTheme] = useState<RESPONSE_DATA>();
    const [loading, setIsLoading] = useState(false);

    const showModal = useCallback(() => setVisible(true), []);
    const onModalClose = useCallback(() => setVisible(false), []);

    const getTheme = useCallback( async () => {
        const data = await fetchTheme(themeId);
        setTheme(data ? data.data : {});
    }, [themeId]);

    const validateThemeName = useCallback((rule, value: string) => {
        return value === theme?.name ? Promise.reject("Name must be different from current one.") : Promise.resolve();
    }, [theme?.name]);

    const onFinish = useCallback( async (value: FormValues) => {
        setIsLoading(true);
        await patchTheme(themeId, value.name);
        setTimeout(() => setIsLoading(true), 1000);
        onModalClose();
    }, [onModalClose, themeId]);

    const renderEditForm = useCallback(() => (
        <Form id="editTheme" name="editTheme" onFinish={onFinish} initialValues={{name: null}} preserve={false}>
            <Form.Item name="name" rules={[{ required: true, message:"Theme name is required" }, { validator: validateThemeName }]} validateTrigger="onBlur">
                <Input placeholder={theme?.name} />
            </Form.Item>

        </Form>
    ), [onFinish, theme?.name, validateThemeName]);

    useEffect(() => {
        getTheme();
    }, [getTheme])

    return (
        <>
        <Button icon={<EditOutlined />} onClick={showModal}/>
        <Modal title="Edit theme" visible={visible} onCancel={onModalClose} destroyOnClose footer={[
            <Button form="editTheme" key="submit" htmlType='submit'>Confirm</Button>
        ]}>
            {renderEditForm()}
        </Modal>
        </>
    )
}

export default React.memo(EditModal);
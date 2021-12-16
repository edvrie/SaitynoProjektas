import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useCallback, useState } from "react";
import { postPost } from "../helpers/apiRequests";

interface Props {
    themeId: string;
}

interface FormData {
    title: string;
    content: string;
}

const PostThemeModal: React.FunctionComponent<Props> = ({ themeId }) => {
    const [visible, setVisible]= useState(false);
    const [loading, setLoading] = useState(false);

    const showModal = useCallback(() => setVisible(true), []);
    const onModalClose = useCallback(() => setVisible(false), []);

    const onFinish = useCallback( async (formData: FormData) => {
        return await postPost(themeId, formData).then(() => onModalClose());
    }, [onModalClose, themeId]);

    const renderForm = useCallback(() => (
        <Form id="postPost" name="postPost" onFinish={onFinish} initialValues={{title: null, content: null}} preserve={false}>
            <Form.Item name="title" rules={[{ required: true, message: "Title is required" }]} validateTrigger="onBlur">
                <Input placeholder="Title" />
            </Form.Item >
            <Form.Item name="content" rules={[{ required: true, message: "Content is required" }]} validateTrigger="onBlur">
                <TextArea rows={6} placeholder="Content..."/>
            </Form.Item>
        </Form>
    ), []);
    
    return (
        <>
        <Button icon={<PlusOutlined/>} onClick={showModal} />
        <Modal title="Add a post" visible={visible} onCancel={onModalClose} destroyOnClose footer={[
            <Button form="postPost" key="submit" htmlType='submit'>Confirm</Button>
        ]}>
            {renderForm()}
        </Modal>
        </>
    )
}

export default React.memo(PostThemeModal)
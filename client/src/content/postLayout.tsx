import { DeleteOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Popconfirm, Typography } from "antd";
import { useForm } from "antd/lib/form/Form";
import TextArea from "antd/lib/input/TextArea";
import { isEmpty } from "ramda";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { deletePost, fetchPost, fetchPosts, patchPost } from "../helpers/apiRequests";

interface POST_DATA {
    _id: string;
    title: string;
    content: string;
    userId: string;
    themeId: string;
}

interface USER {
    userId: string;
    username: string;
    email: string;
    userRole: string;
}

interface Props {
    user: Partial<USER>
}

const PostLayout: React.FunctionComponent<Props> = ({ user }) => {
    const [post, setPost] = useState<POST_DATA>();
    const [isLoading, setIsLoading] = useState(false);
    const {themeId, postId} = useParams();

    const getPost = useCallback(async () => {
        setIsLoading(true);
        if (themeId && postId) {
            const data =  await fetchPost(themeId, postId);
            setPost(data ? data.data : []);
            setTimeout(() => {setIsLoading(false)}, 1000)
        }
        
        //console.log(themeId, postId)
    }, [postId, themeId]);

    useEffect(() => {
        getPost();
    }, [getPost])
    
    return(
        <>
        {isLoading ? <LoadingOutlined
            style={{marginLeft: '50%', marginTop: '20%', marginBottom: '30%', fontSize: '50px'}}
        /> : (
            <Card title={post?.title} extra={
            <>
                {!isEmpty(user) && (user.userId === post?.userId || user.userRole === "ADMIN") ? (
                <>
                <EditPostModal themeId={themeId ? themeId : ""} post={post ? post : {}} />
                <DeletePostPopover themeId={themeId ? themeId : ""} postId={postId ? postId : ""} />
                </>
                ) : (<></>)}
            </>
        }>
                <Typography.Text ellipsis={false}>{post?.content}</Typography.Text>
            </Card>
        )}
        </>
    )
}

interface EditProps {
    themeId: string;
    post: Partial<POST_DATA>;
}

interface FormData {
    title: string;
    content: string;
}

const EditPostModal: React.FunctionComponent<EditProps> = ({ themeId, post }) => {
    const [visible, setVisible] = useState(false);
    
    const showModal = useCallback(() => setVisible(true), []);
    const onModalClose = useCallback(() => setVisible(false), []);

    const onFinish = useCallback( async (formValues: FormData) => {
        if (post._id){
            await patchPost(themeId, post._id, formValues.title, formValues.content)
        }
        onModalClose();
    }, [onModalClose, post._id, themeId]);

    const renderEditForm = useCallback(() => (
        <Form id="editPost" name="editPost" onFinish={onFinish} initialValues={{title: post.title, content: post.content}} preserve={false}>
            <Form.Item name="title" rules={[{ required: true, message: "Title is required" }]} validateTrigger="onBlur">
                <Input />
            </Form.Item >
            <Form.Item name="content" rules={[{ required: true, message: "Content is required" }]} validateTrigger="onBlur">
                <TextArea rows={6}/>
            </Form.Item>
        </Form>
    ), [onFinish, post.content, post.title]);

    
    return (
        <>
        <Button icon={<EditOutlined />} onClick={showModal}/>
        <Modal title="Edit post" visible={visible} onCancel={onModalClose} destroyOnClose footer={[
            <Button form="editPost" key="submit" htmlType='submit'>Confirm</Button>
        ]}>
            {renderEditForm()}
        </Modal>
        </>
    )
}

interface DeleteProps {
    themeId: string;
    postId: string;
}

const DeletePostPopover: React.FunctionComponent<DeleteProps> = ({ themeId, postId }) => {
    const [visible, setVisible] = useState(true);

    const onDeleteConfirm = useCallback( async () => {
        await deletePost(themeId, postId);
    }, [postId, themeId]);

    const onCancelDelete = useCallback(() => {
        setVisible(false);
    }, []);

    return (
        <Popconfirm title="Are you sure you want to delete this post?" placement='topRight' onConfirm={onDeleteConfirm} onCancel={onCancelDelete} okText="Confirm" cancelText="Cancel">
            <Button icon={<DeleteOutlined />} />
        </Popconfirm>
    )
}

export default React.memo(PostLayout);
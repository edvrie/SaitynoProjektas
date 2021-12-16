import { Button, Comment, Drawer, Form, Input, List, Popover } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { deleteComment, fetchComment, fetchComments, patchComment, postComment } from "../helpers/apiRequests";
import { Typography } from 'antd';
import { DeleteOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { useParams } from "react-router-dom";
import { isEmpty } from "ramda";

interface USER {
    userId: string;
    username: string;
    email: string;
    userRole: string;
}

interface Props {
    user: Partial<USER>
}

interface COMMENT_RESPONSE {
    _id: string;
    userId: string;
    postId: string;
    themeId: string;
    content: string;
}

const { Paragraph } = Typography;

const CommentLayout: React.FunctionComponent<Props> = ({ user }) => {
    const [comments, setComments] = useState<COMMENT_RESPONSE[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const {themeId, postId} = useParams();
    const [visible, setVisible] = useState(false);

    const getComments = useCallback( async () => {
        setIsLoading(true);
        const data = await fetchComments(themeId ? themeId : "", postId ? postId : "");
        setComments(data?.data);
        setTimeout(() => {setIsLoading(false)}, 1000);
    }, [postId, themeId]);

    const onVisibleChange = useCallback((visible: boolean) => setVisible(visible), []);

    const onFinish = useCallback( async (formData: FormValues) => {
        await postComment(themeId ? themeId : "", postId ? postId : "", formData.content).then(() => onVisibleChange(false));
    }, [onVisibleChange, postId, themeId]);

    const renderPopoverForm = useCallback(() => (
        <>
        <Form name="addComment" initialValues={{content: ""}} onFinish={onFinish}>
            <Form.Item name="content" rules={[{ required: true, message: "Content is required." }]} validateTrigger="onBlur">
                <TextArea placeholder='Content...'></TextArea>
            </Form.Item>
        </Form>
        <Button form="addComment" key="submit" htmlType='submit'>Add</Button>
        </>
    ), [onFinish]);

    useEffect(() => {
        getComments();
    }, [getComments]);

    return (
        <>
        {isLoading ? <></> : (
        <>
        <List
            className="comment-list"
            header={!isEmpty(user) && (
            <Popover placement='bottomLeft' content={renderPopoverForm()} title="Add new theme" trigger="click" visible={visible} onVisibleChange={onVisibleChange}>
                <Button type="primary" ghost style={{border: 'none', color: 'black', boxShadow: 'none', marginLeft: '95%'}}><PlusOutlined >Add</PlusOutlined></Button>
            </Popover>
            )}
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={ item => (
                <li>
                    <Comment key={item.postId} content={
                    <>
                    {item.content}
                        {!isEmpty(user) && (user.userId === item.userId || user.userRole === "ADMIN") ? <EditCommentSlider themeId={themeId ? themeId : ""} postId={postId ? postId : ""} commentId={item._id} /> : <></>}
                    </>} />
                </li>
            )}

        >
        </List>
        </>
        )}
        </>
    )
}

interface EditProps {
    themeId: string;
    postId: string;
    commentId: string;
}

interface FormValues {
    content: string
}

const EditCommentSlider: React.FunctionComponent<EditProps> = ({ themeId, postId, commentId }) => {
    const [comment, setComment] = useState<COMMENT_RESPONSE>();
    const [visible, setVisible] = useState(false);

    const showDrawer = useCallback(() => {
        setVisible(true);
    }, []);

    const onDrawerClose = useCallback(() => {
        setVisible(false);
    }, []);

    const getComment = useCallback( async () => {
        console.log(themeId, postId, commentId)
        const data = await fetchComment(themeId, postId, commentId);
        setComment(data ? data.data : {});
    }, [commentId, postId, themeId]);

    const onFinish = useCallback( async (formData: FormValues) => {
        await patchComment(themeId, postId, commentId, formData.content);
        onDrawerClose();
    }, [commentId, onDrawerClose, postId, themeId]);

    const renderDrawerForm = useCallback(() => (
        <Form id="editComment" name="editComment" onFinish={onFinish}  initialValues={{content: comment?.content}} preserve={false}>
            <Form.Item name="content" rules={[{ required: true }]}>
                <TextArea rows={6} placeholder="Content..."></TextArea>
            </Form.Item>
        </Form>
    ), [comment?.content, onFinish]);

    const onCommentDelete = useCallback( async () => {
        await deleteComment(themeId ? themeId : "", postId ? postId : "", commentId).then(() => onDrawerClose());
    }, [commentId, onDrawerClose, postId, themeId]);

    useEffect(() => {
        getComment();
    }, [getComment]);

    return (
        <>
        <Button style={{marginLeft: '10%', border: 'none'}} onClick={showDrawer} >Edit</Button>
            <Drawer title="Edit comment" placement="right" width={500} onClose={onDrawerClose} visible={visible} extra={<Button icon={<DeleteOutlined />} onClick={onCommentDelete} />} >
                {renderDrawerForm()}
                <Button form="editComment" key="submit" htmlType="submit">Confirm</Button>
            </Drawer>
        </>
    )
}

export default React.memo(CommentLayout);
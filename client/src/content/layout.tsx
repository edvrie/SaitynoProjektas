import { ArrowRightOutlined, DeleteFilled, DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Card, Space, Typography, Button, Popover, Form, Input } from 'antd';
import 'antd/dist/antd.css';
import { useForm } from 'antd/lib/form/Form';
import { isEmpty } from 'ramda';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts, fetchThemes, postTheme } from '../helpers/apiRequests';
import DeletePopover from './deleteModal';
import EditModal from './editModal';
import PostThemeModal from './postThemeModal';

interface USER {
    userId: string;
    username: string;
    email: string;
    userRole: string;
}

interface Props {
    user: Partial<USER>
}

interface RESPONSE_DATA {
    _id: string;
    name: string;
    userId: string;
}

interface POST_DATA {
    _id: string;
    title: string
    userId: string;
    themeId: string;
}

interface FormData {
    name: string;
}

const { Text } = Typography;

const LayoutCustom: React.FunctionComponent<Props> = ({user}) => {
    const [form] = useForm();
    const [themes, setThemes] = useState<Array<RESPONSE_DATA>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isFormLoading, setIsFormLoading] = useState(false);

    const onVisibleChange = useCallback((visible: boolean) => {
        setVisible(visible)
        if (visible) {
            form.resetFields();
        }
    }, [form]);

    const getThemes = useCallback(async () => {
        setIsLoading(true);
        const data = await fetchThemes();
        setThemes(data ? data.data : []);
        setTimeout(() => {setIsLoading(false)}, 1000)
    }, []);

    const onReload = useCallback(() => {
        window.location.reload();
    }, []);

    const onFinish = useCallback( async (formData: FormData) => {
        setIsFormLoading(true);
        await postTheme(formData.name).then(() => {
            setIsFormLoading(false);
            onVisibleChange(false);
        })
    }, [onVisibleChange]);

    const renderPopoverForm = useCallback(() => (
        <>
        <Form name="addTheme" form={form} initialValues={{name: ""}} onFinish={onFinish}>
            <Form.Item name="name" rules={[{ required: true, message: "Name is required." }]} validateTrigger="onBlur">
                <Input placeholder='Theme name'></Input>
            </Form.Item>
        </Form>
        <Button  loading={isFormLoading} form="addTheme" key="submit" htmlType='submit'>Add</Button>
        </>
    ), [form, isFormLoading, onFinish]);

    
    useEffect(() => {
        getThemes()
    }, [getThemes]);

    return (
        <>
        {isLoading ?
        <LoadingOutlined
            style={{marginLeft: '50%', marginTop: '20%', marginBottom: '30%', fontSize: '50px'}}
        /> : (
            <Card
                title="Themes" extra={<><Button ghost style={{border: 'none', color: 'black', boxShadow: 'none'}} onClick={onReload}><ReloadOutlined /></Button>
            <Popover placement='bottomLeft' content={renderPopoverForm()} title="Add new theme" trigger="click" visible={visible} onVisibleChange={onVisibleChange}>
                 {!isEmpty(user) && <Button type="primary" ghost style={{border: 'none', color: 'black', boxShadow: 'none'}}><PlusOutlined>Add</PlusOutlined></Button>}
            </Popover></>}>
            {themes.map((theme) => (
                        <Card type='inner' title={theme.name} key={theme._id} style={{marginTop: '10px'}} extra={
                        <>
                        {!isEmpty(user) && (user.userId === theme.userId || user.userRole === "ADMIN") ? (<>
                        <PostThemeModal themeId={theme._id}/>
                        <EditModal themeId={theme._id} />
                        <DeletePopover themeId={theme._id} />
                        </>) : <></>}
                        
                        </>
                        }>
                        <Space direction='vertical'>
                            <PostsList theme={theme} />
                        </Space>                   
            </Card> 
            ))}
        </Card> 
        )}
        </>
    );
}

interface PostListProps {
    theme: RESPONSE_DATA;
}

const PostsList: React.FunctionComponent<PostListProps> = ({theme}) => {
    const [posts, setPosts] = useState<Array<POST_DATA>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const getPosts = useCallback( async () => {
        setIsLoading(true);
        const tmpArray: Array<POST_DATA> = []
            fetchPosts(theme._id).then((data) => {
                if (data) {
                    data.data.map((value: POST_DATA) => tmpArray.push(value))
                }
            });
        setPosts(tmpArray);
        setTimeout(() => {setIsLoading(false)}, 1000)
    }, [theme._id]);

    useEffect(() => {
        getPosts();
    }, [getPosts]);

    return (
    <>
    {isLoading && <LoadingOutlined  />}
    {posts ? posts.map((post) => post.themeId === theme._id && (
        <>
                <Link to={`/themes/${theme._id}/posts/${post._id}`} key={post._id}>{post.title}</Link>
                <br />
                </>
    )) : <></>}
    </>
    )
}

export default LayoutCustom;
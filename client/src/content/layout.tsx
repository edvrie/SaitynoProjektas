import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { Card, Space, Typography } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import {fetchPosts, fetchThemes} from '../helpers/apiRequests'

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

const { Text } = Typography;

const LayoutCustom: React.FunctionComponent = () => {
    const [themes, setThemes] = useState<Array<RESPONSE_DATA>>([]);
    const [posts, setPosts] = useState<Array<POST_DATA>>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getPosts = useCallback( async () => {
        const tmpArray: Array<POST_DATA> = []
        themes.forEach( async (theme) => {
            fetchPosts(theme._id).then((data) => {
                if (data) {
                    data.data.map((value: POST_DATA) => tmpArray.push(value))
                }
            });
        })
        setPosts(tmpArray);
        setTimeout(() => {setIsLoading(false)}, 1000)
    }, [themes]);

    const getThemes = useCallback(async () => {
        const data = await fetchThemes();
        setThemes(data ? data.data : []);
    }, []);

    

    useEffect(() => {
        getThemes()
    }, [getThemes]);

    useEffect(() => {
        getPosts();
    }, [getPosts])

    return (
        <>
        {isLoading ? <LoadingOutlined style={{marginLeft: '50%', marginTop: '20%', marginBottom: '30%', fontSize: '50px'}} /> : (
            <Card title="Themes">
            {themes.map(({name, _id}) => (
                <Card type='inner' title={name} key={_id} extra={<ArrowRightOutlined key={_id} />} style={{marginTop: '10px'}}>
                    <Space direction='vertical'>
                    {posts.map((post, index) => post.themeId === _id && (
                        <Text key={post._id}>{post.title}</Text>
                    ))}
                    </Space>                   
                </Card> 
            ))}
        </Card> 
        )}
        </>
    );
}

export default LayoutCustom;
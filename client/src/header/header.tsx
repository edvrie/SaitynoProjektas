import 'antd/dist/antd.css';
import * as R from 'ramda';
import React, { useCallback, useContext, useState } from "react";
import LoginButton from './login';
import SignUpButton from './signup';
import { Avatar, Popover } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { userContext } from '../helpers/userManagement';

interface Props {
    user?: object;
}

const HeaderCustom: React.FunctionComponent<Props> = (props) => {
    const { isEmpty } = R;
    const [visible, setVisible] = useState(false);
    console.log(visible);
    const { userData, setUserData } = useContext(userContext);

    const onVisibleChange = useCallback((visible: boolean) => setVisible(visible), []);

    const onLogout = useCallback(() => {
        localStorage.clear();
        setUserData({});
        setVisible(false);
    }, [setUserData]);

    return(
        <>
        <div className="float-left">
            <p className="text-white font-mono" style={{fontSize: 'xx-large'}}>Forum</p>
        </div>
            <div className="float-right">
                {isEmpty(props.user) ? (
                <>
                    <LoginButton />
                    <SignUpButton />
                </>
                ) : (
                <Popover
                content={<a onClick={onLogout}>Log out</a>}
                trigger="click"
                visible={visible}
                onVisibleChange={onVisibleChange}
                style={{position: 'fixed'}}
              >
                <Avatar icon={<UserOutlined />} />
              </Popover>
                )}

                
            </div>
        </>
    )
}

export default React.memo(HeaderCustom);
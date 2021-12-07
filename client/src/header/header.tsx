import React from "react";
import LoginButton from './login';
import SignUpButton from './signup';
import 'antd/dist/antd.css';

const HeaderCustom: React.FunctionComponent = () => {
    return(
        <>
        <div className="float-left">
            <p className="text-white font-mono" style={{fontSize: 'xx-large'}}>Forum</p>
        </div>
            <div className="float-right">
                <LoginButton />
                <SignUpButton />
            </div>
        </>
    )
}

export default React.memo(HeaderCustom);
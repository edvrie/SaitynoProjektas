import React from 'react';
import { Button } from 'antd';
import 'antd/dist/antd.css';

const SignUpButton: React.FunctionComponent = () => {

    return ( 
        <Button ghost style={{borderColor: 'black'}}>Sign up</Button>
    )
}

export default React.memo(SignUpButton);
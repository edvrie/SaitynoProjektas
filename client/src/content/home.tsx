import { Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/welcome.jpg'

const HomePage: React.FunctionComponent = () => {
    return (
        <div style={{height:'20%', width:'20%', minHeight:'10%', minWidth:'10%', margin:'auto'}}>
            <img src={logo}></img>
            <Button style={{marginTop: '5%', marginLeft: '25%'}} ><Link to={`/themes`}>Browse themes</Link></Button>
        </div>
    )
}

export default HomePage;
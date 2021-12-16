import React, { useMemo, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HeaderCustom from './header/header';
import { Layout, Space } from 'antd';
import 'antd/dist/antd.css';
import LayoutCustom from './content/layout';
import { getUserData, userContext } from './helpers/userManagement';
import PostLayout from './content/postLayout';
import HomePage from './content/home';

function App() {
  const { Header, Footer, Content } = Layout;
  
  const userDataFromLocal = getUserData();
  const reformattedData = userDataFromLocal ? {
      userId: userDataFromLocal[0],
      username: userDataFromLocal[1],
      email: userDataFromLocal[2],
      userRole: userDataFromLocal[3]
  } : null;
  const [userData, setUserData] = useState(reformattedData ? reformattedData : {});
  const value = !reformattedData ? {userData: {}, setUserData: setUserData } : {userData: reformattedData, setUserData: setUserData };
  console.log(userData)
  return (
    <userContext.Provider value={value}>
    <Layout className='layout' style={{backgroundColor: 'white'}}>
      <Space direction='vertical'>
      <Header style={{position: 'fixed', zIndex:1, width: '100%', backgroundColor: 'black'}}>
  
        <HeaderCustom user={userData} />
 
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64, overflow: 'hidden'}} >
      <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/themes' element={<LayoutCustom user={userData} />} />
          <Route path='/themes/:themeId/posts/:postId' element={<PostLayout user={userData}/>} />
      </Routes>
      </Content>
      <Footer style={{marginTop: '22%'}}>
          <p>© Edvinas Riepšas IFF-8/12</p>
       </Footer>
       </Space>
     </Layout>
     </userContext.Provider>
  );
}

export default App;

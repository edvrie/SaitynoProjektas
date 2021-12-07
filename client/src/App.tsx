import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HeaderCustom from './header/header';
import { Layout, Space } from 'antd';
import 'antd/dist/antd.css';
import LayoutCustom from './content/layout';

function App() {
  const { Header, Footer, Content } = Layout;
  return (
  
    <Layout className='layout' style={{backgroundColor: 'white'}}>
      <Space direction='vertical'>
      <Header style={{position: 'fixed', zIndex:1, width: '100%', backgroundColor: 'black'}}>
        <HeaderCustom />
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64, overflow: 'hidden'}} >
      <Routes>
          <Route path='/themes' element={<LayoutCustom />} />
      </Routes>
      </Content>
      <Footer>

       </Footer>
       </Space>
     </Layout>
  );
}

export default App;

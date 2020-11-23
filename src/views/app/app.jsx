import React,{Component} from 'react'
//import axios from 'axios';

import { Layout } from 'antd';

import SectionLeft from '../../containers/section-left/section-left'
import SectionRight from '../../containers/section-right/section-right'
export default class AppLayout extends Component {
  render(){
      return(
              <Layout style={{ minHeight: '100vh' }}>
                <SectionLeft />
                <SectionRight />
              </Layout>
            );
          
        }
}


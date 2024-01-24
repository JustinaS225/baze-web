import React from 'react';
import styles from './index.module.scss';
import TitleLogo from '../common/TitleLogo';
import { IAssetsCollection } from '@/interfaces/firestore';

type Props = {
  data: IAssetsCollection;
}

const Home = ({data}: Props) => {
  const commonData = data.static.common;
  const pageData = data.static.pageData;

  return ( 
    <div className={styles.wrap}>
      <div className={styles.innerWrap}>
        <TitleLogo title={commonData.strings.app_title}/>
        
      </div>
    </div>
   );
}
 
export default Home;
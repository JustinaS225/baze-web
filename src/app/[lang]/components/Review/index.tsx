import React from 'react';
import styles from './index.module.scss';
import TitleLogo from '../common/TitleLogo';
import { IAssetsCollection } from '@/interfaces/firestore';
import Navs from '../common/Navs';

type Props = {
  data: IAssetsCollection;
}

const Review = ({data}: Props) => {
  const commonData = data.static.common;
  const pageData = data.static.pageData;

  const navs = [
    {title: commonData.strings.nav_title_home, path: commonData.strings.nav_path_home},
    {title: commonData.strings.nav_title_writings, path: commonData.strings.nav_path_writings},
    {title: commonData.strings.nav_title_reviews, path: commonData.strings.nav_path_reviews},
  ]

  return ( 
    <div className={styles.wrap}>
      <div className={styles.innerWrap}>
        <TitleLogo title={commonData.strings.app_title}/>
        <Navs navs={navs}/>
      </div>
    </div>
   );
}
 
export default Review;
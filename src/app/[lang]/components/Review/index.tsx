import React from 'react';
import styles from './index.module.scss';
import TitleLogo from '../common/TitleLogo';
import { IAlbumData, IAssetsCollection } from '@/interfaces/firestore';
import Navs from '../common/Navs';
import MainContent from './MainContent';

type Props = {
  data: IAssetsCollection;
  albumData: IAlbumData;
}

const Review = ({data, albumData}: Props) => {
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
        <MainContent albumData={albumData} pageData={pageData}/>
      </div>
    </div>
   );
}
 
export default Review;
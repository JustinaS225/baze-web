import React from 'react';
import styles from './index.module.scss';
import { IAlbumData, IAssetData } from '@/interfaces/firestore';
import RatingMeter from '../../common/RatingMeter';

type Props = {
  albumData: IAlbumData;
  pageData: IAssetData;
}

const MainContent = ({albumData, pageData}: Props) => {
  return ( 
    <div className={styles.wrap}>
      <RatingMeter rating={4}/>
    </div>
   );
}
 
export default MainContent;
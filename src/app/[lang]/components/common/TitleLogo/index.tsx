import React from 'react';
import styles from './index.module.scss';

type Props = {
  title: string;
}

const TitleLogo = ({title}: Props) => {
  return ( 
    <div className={styles.wrap}>
      <div className={styles.title}>
        {title}
      </div>
    </div>
   );
}
 
export default TitleLogo;
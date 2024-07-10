import React from 'react';
import styles from './index.module.scss';
import { INavs } from '@/interfaces/common';
import Link from 'next/link';

type Props = {
  navs: INavs[];
}

const Navs = ({navs}: Props) => {
  return ( 
    <div className={styles.wrap}>
      {navs.map((nav, index) => {
        return (
          <Link key={index} href={nav.path} className={styles.link}>
            {nav.title}
          </Link>
        )
      })}
    </div>
   );
}
 
export default Navs;
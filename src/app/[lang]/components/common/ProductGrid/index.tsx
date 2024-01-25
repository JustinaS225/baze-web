import * as React from 'react';
import styles from './index.module.scss';
import { IDynamicAssetDataImage } from '@/interfaces/firestore';
import { IAlbumList } from '@/interfaces/common';
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import { Timestamp } from 'firebase-admin/firestore';
import 'moment/locale/lt';

type Props = {
  productsImages: IDynamicAssetDataImage[];
  productsInfo: IAlbumList[];
  productsSlugs: string[]; 
  currentEndpoint: string;
}


const ProductGrid = ({productsImages, productsInfo, productsSlugs, currentEndpoint}: Props) => {
  const createdAtDateArray = productsInfo.map((product) => product.created_at.toDate());
  moment.locale('lt'); 
  const timeAgoArray = createdAtDateArray.map((date) => moment(date).fromNow());

  const handleDate = (timestamp: Timestamp) => {

  }

  return ( 
    <div className={styles.wrap}>
      <div className={styles.innerWrap}>
        {productsInfo.map((product, index) => {
          return (
                <div className={styles.productWrap}>
                  <Link href={`${currentEndpoint}/${productsSlugs[index]}`} className={styles.link}>
                    <div className={styles.productImageWrap}>
                      <Image 
                        src={productsImages[index].image_url}
                        alt={productsImages[index].product_name}
                        fill
                        sizes='(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
                      />
                    </div>
                  </Link>
                  <div className={styles.productInfoWrap}>
                    <div className={styles.author}>{product.author}</div>
                    <div className={styles.title}>{product.title}</div>
                    <div className={styles.type}>{product.type}</div>
                    <div className={styles.genre}>{product.genre}</div>
                    <div className={styles.createdAt}>{timeAgoArray[index]}</div>
                  </div>
                </div>
          )
        })}
      </div>
    </div>
   );
}
 
export default ProductGrid;
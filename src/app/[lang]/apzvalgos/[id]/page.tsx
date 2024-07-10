import Image from "next/image";
import styles from "./page.module.scss";
import { getAssetsReusable } from "@/utils/firebase/getAssetsReusable";
import { IAlbumData, IAssetsCollection, IAssetsDynamicSubcollection } from "@/interfaces/firestore";
import Review from "../../components/Review";
import { fetchAlbumData } from "@/utils/firebase/firebaseFetching";


type Props = {
  params: {
    lang: string;
    id: string;
  },
}

export async function generateStaticParams({params}: Props) {
  const data: IAssetsCollection = await getAssetsReusable(params.lang, 'reviews', ['albums']);
  return data.dynamic.albums.slugs.map((slug: string) => ({id: slug}));
}

export const dynamicParams = false;

const ReviewPage = async ({params}: Props) => {
  const data: IAssetsCollection = await getAssetsReusable(params.lang, 'reviews', ['albums']);
  const albumData: IAlbumData = await fetchAlbumData('Albums', params.id);

  return (
    <div className={styles.wrap}>
      <Review data={data} albumData={albumData}/>
    </div>
  );
}

export default ReviewPage;

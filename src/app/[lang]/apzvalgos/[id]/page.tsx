import Image from "next/image";
import styles from "./page.module.scss";
import { getAssetsReusable } from "@/utils/firebase/getAssetsReusable";
import { IAssetsCollection } from "@/interfaces/firestore";


type Props = {
  params: {
    lang: string;
  }
}

const ReviewPage = async ({params}: Props) => {
  const data: IAssetsCollection = await getAssetsReusable(params.lang, 'reviews', ['albums']);

  return (
    <div className={styles.wrap}>
      DINAMIŠKA JAUNATVIŠKA SUSTAINABLE
    </div>
  );
}

export default ReviewPage;

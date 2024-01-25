import Image from "next/image";
import styles from "./page.module.scss";
import { getAssetsReusable } from "@/utils/firebase/getAssetsReusable";
import { IAssetsCollection } from "@/interfaces/firestore";
import Reviews from "../components/Reviews";

type Props = {
  params: {
    lang: string;
  }
}

const ReviewsPage = async ({params}: Props) => {
  const data: IAssetsCollection = await getAssetsReusable(params.lang, 'reviews', []);

  return (
    <div className={styles.wrap}>
      <Reviews data={data}/>
    </div>
  );
}

export default ReviewsPage;

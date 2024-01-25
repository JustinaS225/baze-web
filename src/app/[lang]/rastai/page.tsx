import Image from "next/image";
import styles from "./page.module.scss";
import { getAssetsReusable } from "@/utils/firebase/getAssetsReusable";
import { IAssetsCollection } from "@/interfaces/firestore";
import Writings from "../components/Writings";

type Props = {
  params: {
    lang: string;
  }
}

const WritingsPage = async ({params}: Props) => {
  const data: IAssetsCollection = await getAssetsReusable(params.lang, 'writings', []);

  return (
    <div className={styles.wrap}>
      <Writings data={data}/>
    </div>
  );
}

export default WritingsPage;

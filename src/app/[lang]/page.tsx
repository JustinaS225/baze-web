import Image from "next/image";
import styles from "./home/page.module.scss";
import Home from "./components/Home";
import { getAssetsReusable } from "@/utils/firebase/getAssetsReusable";
import { IAssetsCollection } from "@/interfaces/firestore";

type Props = {
  params: {
    lang: string;
  }
}

const HomePage = async ({params}: Props) => {
  const data: IAssetsCollection = await getAssetsReusable(params.lang, 'index', []);

  return (
    <div className={styles.wrap}>
      <Home data={data}/>
    </div>
  );
}

export default HomePage;

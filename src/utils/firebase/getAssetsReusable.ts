import { i18n } from "@/i18n-config";
import { IAssetsCollection } from "@/interfaces/firestore";
import { fetchData } from "./firebaseFetching";

export const getAssetsReusable = async (locale: string = i18n.defaultLocale, pageId: string, dynamicAssets: string[] = [] ): Promise<IAssetsCollection> => {
  try {
    const data: IAssetsCollection = await fetchData(pageId, locale, dynamicAssets);
    return data;
  } catch (error) {
    console.error("Failed to fetch assets:", error);
    return {
      static: {common: {
        images: {},
        strings: {},
      }, pageData: {
        images: {},
        strings: {},
      }},
      dynamic: {}
    };
  }
}
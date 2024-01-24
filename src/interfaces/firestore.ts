export type IDataProps = {
  data: IAssetsCollection;
  params?: {
      product: string;
  }
}

export type IAssetsCollection = {
  static: IAssetsStaticSubcollection,
  dynamic: IAssetsDynamicSubcollection
}

export type IAssetsStaticSubcollection = {
  common: IAssetData,
  pageData: IAssetData,
}

export type IAssetsDynamicSubcollection = {
  [key: string]: IDynamicAssetData;
}

export type IAssetData = {
  images: {
      [key: string]: IAsset;
  },
  strings: {
      [key: string]: string;
  }
}

export type IAsset = {
  image_url: string;
  image_name: string;
}

export type IDynamicAssetData = {
  images: IDynamicAssetDataImage[];
  strings: string[];
  slugs: string[];   
}

export type IDynamicAssetDataImage = {
  image_url: string;
  product_name: string;
  product_id: string;
}

export type IFirestoreProductDocument = {
  image_url: string;
  product_description_en: string;
  product_description_lt: string;
  product_id: string;
  product_name: string;
  product_title_en: string;
  product_title_lt: string;
  additionalImages: {
      [key: string]: IAdditionalImage;
  }
}

export type IAdditionalImage = {
  image_url: string;
  product_id: string;
  product_name: string;
}

export type ISliderImageData = {
  id: string,
  title: string,
  imageUrl: string,
}

export type IImageData = {
  url: string,
  size: number;
  id: string;
  title: string;
  slug: string;
}
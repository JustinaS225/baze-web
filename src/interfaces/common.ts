import { Timestamp } from "firebase-admin/firestore"

export type IActive = {
  parentState: boolean,
}

export type INavs = {
  title: string,
  path: string,
}

export type IAlbumList = {
  author: string,
  title: string,
  type: string,
  genre: string,
  review_author: string,
  created_at: Timestamp,
}
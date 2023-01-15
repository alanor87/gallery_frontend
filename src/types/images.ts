export interface NewImageInfoType {
  _id: string;
  imageInfo: any;
}

export interface SelectedImageType {
  selectedId: string;
  isPublic: boolean;
}

export type GalleryType = "userGallery" | "sharedGallery" | "publicGallery";

export interface NewImageInfoType {
  _id: string;
  imageInfo: any;
}

export interface ImageInfoType {
  tags: string;
  likes: string[];
  isLoading: boolean;
  isSelected: boolean;
  isPublic: boolean;
  belongsTo: string;
  openedTo: string[];
  title?: string;
  description?: string;
}

export interface SelectedImageType {
  selectedId: string;
  isPublic: boolean;
}

export type GalleryType = "userGallery" | "sharedGallery" | "publicGallery";

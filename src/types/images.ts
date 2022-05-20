export interface NewImageInfoType {
  _id: string;
  imageInfo: any;
}

export interface DescriptionAnchorType {
  anchorText : string;
  anchorTextStartPos: number;
}

export interface ImageDescriptionType {
  text: string;
  anchors: DescriptionAnchorType[];

}

export interface ImageInfoType {
  tags: string;
  likes?: string[];
  isLoading?: boolean;
  isSelected?: boolean;
  isPublic?: boolean;
  belongsTo?: string;
  openedTo?: string[];
  title?: string;
  description?: ImageDescriptionType;
}

export interface SelectedImageType {
  selectedId: string;
  isPublic: boolean;
}

export type GalleryType = "userGallery" | "sharedGallery" | "publicGallery";

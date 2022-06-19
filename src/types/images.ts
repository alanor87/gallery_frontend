export interface NewImageInfoType {
  _id: string;
  imageInfo: any;
}

export interface DescriptionAnchorType {
  _id?: string;
  anchorText: string;
  anchorTextStartPos: number;
  anchorFrameCoords: number[];
  anchorFrameSize: number[];
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

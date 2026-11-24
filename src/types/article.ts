// Journal types, as the backend sends them (toys.v1.JournalService).

export type BlockWidth =
  'BLOCK_WIDTH_UNSPECIFIED' | 'BLOCK_WIDTH_NORMAL' | 'BLOCK_WIDTH_WIDE' | 'BLOCK_WIDTH_FULL_BLEED';

export type GalleryLayout =
  | 'GALLERY_LAYOUT_UNSPECIFIED'
  | 'GALLERY_LAYOUT_GRID'
  | 'GALLERY_LAYOUT_CAROUSEL'
  | 'GALLERY_LAYOUT_BEFORE_AFTER';

export type ListStyle =
  'LIST_STYLE_UNSPECIFIED' | 'LIST_STYLE_BULLET' | 'LIST_STYLE_NUMBERED' | 'LIST_STYLE_CHECKLIST';

export type VideoProvider =
  | 'VIDEO_PROVIDER_UNSPECIFIED'
  | 'VIDEO_PROVIDER_YOUTUBE'
  | 'VIDEO_PROVIDER_VIMEO'
  | 'VIDEO_PROVIDER_FILE';

export type CalloutKind =
  'CALLOUT_KIND_UNSPECIFIED' | 'CALLOUT_KIND_TIP' | 'CALLOUT_KIND_WARNING' | 'CALLOUT_KIND_NOTE';

/** Image metadata shared by covers, image blocks, galleries and author photos. */
export interface IArticleImage {
  url: string;
  width?: number;
  height?: number;
  /** An explicitly empty value marks a decorative image. */
  alt?: string;
  caption?: string;
}

export interface IArticlePreview {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  cover?: IArticleImage;
  /** RFC 3339 timestamp. */
  publishedAt?: string;
  isPinned?: boolean;
}

export interface IHeadingBlock {
  text: string;
  /** 2 or 3. */
  level?: number;
}

export interface ITextBlock {
  /** Sanitized HTML: p, strong, em, a, br. */
  html: string;
}

export interface IImageBlock {
  image: IArticleImage;
}

export interface IGalleryBlock {
  images?: IArticleImage[];
  layout?: GalleryLayout;
}

export interface IQuoteBlock {
  text: string;
  author?: string;
  role?: string;
}

export interface IListBlock {
  style?: ListStyle;
  items?: { html: string }[];
}

export interface IVideoBlock {
  provider?: VideoProvider;
  /** Provider-specific identifier, or a public URL when the provider is FILE. */
  idOrUrl: string;
  posterUrl?: string;
  caption?: string;
}

export interface IProductsBlock {
  productIds?: number[];
  title?: string;
}

export interface ICalloutBlock {
  kind?: CalloutKind;
  html: string;
  title?: string;
}

/** Exactly one block member is set, mirroring the protobuf oneof. */
export interface IArticleBlock {
  anchor?: string;
  width?: BlockWidth;
  heading?: IHeadingBlock;
  text?: ITextBlock;
  image?: IImageBlock;
  gallery?: IGalleryBlock;
  quote?: IQuoteBlock;
  list?: IListBlock;
  video?: IVideoBlock;
  products?: IProductsBlock;
  callout?: ICalloutBlock;
  divider?: Record<string, never>;
}

export interface IArticleAuthor {
  name: string;
  role?: string;
  photo?: IArticleImage;
}

export interface ISeoMeta {
  title?: string;
  description?: string;
  ogImageUrl?: string;
}

export interface IArticle extends IArticlePreview {
  blocks?: IArticleBlock[];
  /** Products for the whole article, shown after the body. */
  relatedProductIds?: number[];
  author?: IArticleAuthor;
  readingMinutes?: number;
  tags?: string[];
  updatedAt?: string;
  seo?: ISeoMeta;
  /** BCP 47 language tag of this version. */
  locale?: string;
}

/** A type alias, not an interface, so it satisfies the `params` record of a request. */
export type IListArticlesParams = {
  pageSize?: number;
  pageToken?: string;
};

export interface IListArticlesResponse {
  articlePreviews?: IArticlePreview[];
  /** Empty when there are no more articles. */
  nextPageToken?: string;
}

export interface IGetArticleResponse {
  article: IArticle;
}

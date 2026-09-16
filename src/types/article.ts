// Journal types, as the backend sends them (toys.v1.JournalService).

export interface IArticlePreview {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  coverImageUrl?: string;
  /** ISO 8601 date, YYYY-MM-DD. */
  publishedAt?: string;
  /** Pinned articles come first in the listing. */
  isPinned?: boolean;
}

/**
 * One block of an article body. The contract uses a string discriminator with flat optional
 * fields, so the fields that belong to other block types are absent rather than typed away.
 */
export interface IArticleBlock {
  type: 'text' | 'image' | 'quote';
  /** Block type "text": HTML sanitized by the backend. */
  html?: string;
  /** Block type "image". */
  src?: string;
  alt?: string;
  caption?: string;
  /** Block type "quote". */
  text?: string;
  author?: string;
}

export interface IArticle extends IArticlePreview {
  blocks?: IArticleBlock[];
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

import './ArticleVideo.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import type { IVideoBlock } from '@/types/article';

interface ArticleVideoProps {
  video: IVideoBlock;
}

const EMBED_URLS = {
  VIDEO_PROVIDER_YOUTUBE: (id: string): string => `https://www.youtube-nocookie.com/embed/${id}`,
  VIDEO_PROVIDER_VIMEO: (id: string): string => `https://player.vimeo.com/video/${id}`,
} as const;

/** A video block: a provider embed, or the file itself when the article hosts one. */
const ArticleVideo = ({ video }: ArticleVideoProps): ReactElement | null => {
  const { t } = useTranslation('journalSection');
  const { provider = 'VIDEO_PROVIDER_UNSPECIFIED', idOrUrl, posterUrl, caption } = video;

  if (!idOrUrl) return null;

  const embed = provider in EMBED_URLS ? EMBED_URLS[provider as keyof typeof EMBED_URLS] : null;

  return (
    <figure className="article-video">
      {embed ? (
        <iframe
          src={embed(idOrUrl)}
          title={caption ?? t('journal.video')}
          allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="article-video__frame"
        />
      ) : (
        <video src={idOrUrl} poster={posterUrl} controls className="article-video__player" />
      )}
      {caption && <figcaption className="article-video__caption">{caption}</figcaption>}
    </figure>
  );
};

export default ArticleVideo;

import './Legal.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import type { LegalPage } from '@/app/routes';

interface LegalProps {
  page: LegalPage;
}

/** One block of a text page; a heading may be empty, a list may follow the paragraphs. */
interface ILegalSection {
  title: string;
  level?: number;
  paragraphs: string[];
  items?: string[];
}

interface ILegalContent {
  title: string;
  intro?: string;
  sections: ILegalSection[];
}

/**
 * A plain text page from the footer. The copy comes from the team's Notion pages; places still
 * to be decided are marked in square brackets.
 */
const Legal = ({ page }: LegalProps): ReactElement => {
  const { t } = useTranslation('legalSection');
  const content: ILegalContent = t(`pages.${page}`, { returnObjects: true });

  return (
    <div className="legal-page">
      <article className="container legal">
        <h1 className="legal__title">{content.title}</h1>
        <div className="legal__card">
          {content.intro && <p className="legal__intro">{content.intro}</p>}
          {content.sections.map((section, index) => {
            const Heading = section.level === 3 ? 'h3' : 'h2';
            return (
              <section key={`${section.title}-${index}`} className="legal__section">
                {section.title && (
                  <Heading
                    className={clsx(
                      'legal__heading',
                      section.level === 3 && 'legal__heading--minor'
                    )}
                  >
                    {section.title}
                  </Heading>
                )}
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="legal__text">
                    {paragraph}
                  </p>
                ))}
                {section.items && (
                  <ul className="legal__list">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </article>
    </div>
  );
};

export default Legal;

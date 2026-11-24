import './Footer.scss';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LEGAL_PAGES } from '@/app/routes';
import { useLinks } from '@/app/useLinks';

const EMAIL = 'thekeepers@gmail.com';
// Placeholders until the shop's Instagram account and review page are known.
const INSTAGRAM_URL = '#';
const REVIEW_URL = '#';

/** The shop's card at the bottom of every page: who we are and how to reach us. */
const Footer = (): ReactElement => {
  const { t } = useTranslation();
  const links = useLinks();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__card">
          <div className="footer__main">
            <div className="footer__brand">
              <img
                src="/brand/logo-the-keepers.svg"
                alt={t('brand.name')}
                width={276}
                height={296}
                className="footer__logo"
              />
              <div className="footer__about">
                <p className="footer__tagline">{t('footer.tagline')}</p>
                <p className="footer__location">
                  <img src="/icons/pin.svg" alt="" width={28} height={28} />
                  {t('footer.location')}
                </p>
              </div>
            </div>

            <ul className="footer__contacts">
              <li className="footer__contact">
                <a href={`mailto:${EMAIL}`} className="footer__contact-link">
                  <img src="/icons/mail.svg" alt="" width={32} height={32} />
                  {t('footer.email')}
                </a>
                <span className="footer__contact-caption">{t('footer.emailCaption')}</span>
              </li>
              <li className="footer__contact">
                <a href={INSTAGRAM_URL} className="footer__contact-link">
                  <img src="/icons/instagram.svg" alt="" width={32} height={32} />
                  {t('footer.instagram')}
                  <img src="/icons/arrow-right-brown.svg" alt="" width={24} height={24} />
                </a>
                <span className="footer__contact-caption">{t('footer.instagramCaption')}</span>
              </li>
              <li className="footer__contact">
                <a href={REVIEW_URL} className="footer__contact-link">
                  <img src="/icons/star.svg" alt="" width={32} height={32} />
                  {t('footer.review')}
                  <img src="/icons/arrow-right-brown.svg" alt="" width={24} height={24} />
                </a>
                <span className="footer__contact-caption">{t('footer.reviewCaption')}</span>
              </li>
            </ul>
          </div>

          <ul className="footer__legal">
            {LEGAL_PAGES.map((page) => (
              <li key={page}>
                <Link to={links.legal[page]} className="footer__legal-link">
                  {t(`footer.legal.${page}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

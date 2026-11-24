import './Footer.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

const EMAIL = 'thekeepers@gmail.com';

/** The shop's card at the bottom of every page: who we are and how to reach us. */
const Footer = (): ReactElement => {
  const { t } = useTranslation();
  const legal = t('footer.legal', { returnObjects: true });

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
                <span className="footer__contact-link">
                  <img src="/icons/instagram.svg" alt="" width={32} height={32} />
                  {t('footer.instagram')}
                  <img src="/icons/arrow-right-brown.svg" alt="" width={24} height={24} />
                </span>
                <span className="footer__contact-caption">{t('footer.instagramCaption')}</span>
              </li>
              <li className="footer__contact">
                <span className="footer__contact-link">
                  <img src="/icons/star.svg" alt="" width={32} height={32} />
                  {t('footer.review')}
                  <img src="/icons/arrow-right-brown.svg" alt="" width={24} height={24} />
                </span>
                <span className="footer__contact-caption">{t('footer.reviewCaption')}</span>
              </li>
            </ul>
          </div>

          <ul className="footer__legal">
            {legal.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

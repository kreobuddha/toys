import './Footer.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

const Footer = (): ReactElement => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container">
        © {new Date().getFullYear()} Toys. {t('footer.rights')}
      </div>
    </footer>
  );
};

export default Footer;

import './NotFound.scss';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useLinks } from '@/app/useLinks';
import { useTranslation } from 'react-i18next';

const NotFound = (): ReactElement => {
  const { t } = useTranslation();
  const links = useLinks();
  return (
    <section className="container not-found">
      <h1 className="not-found__title">{t('common.notFound')}</h1>
      <Link to={links.home}>{t('nav.home')}</Link>
    </section>
  );
};

export default NotFound;

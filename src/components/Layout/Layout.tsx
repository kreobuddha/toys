import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import styles from './Layout.module.scss';

export function Layout() {
  return (
    <div className={styles.root}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

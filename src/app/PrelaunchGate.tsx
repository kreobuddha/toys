import type { ReactElement, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useLinks } from './useLinks';
import { getRuntimeConfig } from './runtimeConfig';

interface PrelaunchGateProps {
  children: ReactNode;
}

/** Pages that sell send the customer to the shop's launch announcement until it opens. */
const PrelaunchGate = ({ children }: PrelaunchGateProps): ReactElement => {
  const links = useLinks();
  if (getRuntimeConfig().prelaunch) return <Navigate to={links.shop} replace />;
  return <>{children}</>;
};

export default PrelaunchGate;

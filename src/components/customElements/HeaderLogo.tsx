import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Logo } from '../../svg';

function HeaderLogo() {
  const { t } = useTranslation();
  return (
    <div className="navbar-start flex items-center gap-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center">
        <Logo />
      </div>
      <Link to="/">
        <div className="text-2xl font-bold">{t('MENU_APP_NAME', { ns: 'common' })}</div>
      </Link>
    </div>
  );
}

export default HeaderLogo;

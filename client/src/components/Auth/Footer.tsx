import { authGlassFooterLinkClassName } from './authStyles';

const COMPANY_SITE_URL = 'https://www.tynesys.com';
const COMPANY_FOOTER_LABEL = 'TYNE';

function Footer() {
  return (
    <div className="align-end m-4 flex justify-center gap-2" role="contentinfo">
      <a
        className={authGlassFooterLinkClassName}
        href={COMPANY_SITE_URL}
        rel="noreferrer"
        target="_blank"
      >
        {COMPANY_FOOTER_LABEL}
      </a>
    </div>
  );
}

export default Footer;

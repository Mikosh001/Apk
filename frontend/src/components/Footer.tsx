import { strings } from '../i18n/kk';

export const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div>
        <strong>AgroFuture Lab</strong>
        <p>{strings.footer.tagline}</p>
      </div>
      <div className="footer-links">
        <a href="mailto:contact@apk.kz">contact@apk.kz</a>
        <a href="https://t.me/apkfuture" rel="noreferrer" target="_blank">
          Telegram
        </a>
      </div>
    </footer>
  );
};

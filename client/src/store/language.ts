import { atom } from 'recoil';
import Cookies from 'js-cookie';
import { atomWithLocalStorage } from './utils';

const readStoredLang = () => {
  if (typeof localStorage === 'undefined') {
    return undefined;
  }

  const storedLang = localStorage.getItem('lang');
  if (!storedLang) {
    return undefined;
  }

  try {
    const parsedLang = JSON.parse(storedLang);
    return typeof parsedLang === 'string' ? parsedLang : storedLang;
  } catch {
    return storedLang;
  }
};

/** 使用者自己選過的語言優先（cookie、localStorage），否則依瀏覽器語言自動偵測；
 *  設定頁的語言選單預設就顯示這個偵測結果。 */
const defaultLang = () => {
  const userLang =
    (typeof navigator !== 'undefined' ? navigator.language || navigator.languages?.[0] : null) ??
    'en';
  return Cookies.get('lang') || readStoredLang() || userLang;
};

const lang = atomWithLocalStorage('lang', defaultLang());
const languageLoading = atom<boolean>({
  key: 'languageLoading',
  default: false,
});

export default { lang, languageLoading };

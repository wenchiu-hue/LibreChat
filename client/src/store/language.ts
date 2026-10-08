import { atom } from 'recoil';
import { atomWithLocalStorage } from './utils';

/**
 * TYNESYS: keep the product UI in English. Any previously stored browser locale
 * (e.g. zh-Hant) is normalized back to `en` on load.
 */
const lang = atomWithLocalStorage('lang', 'en', () => 'en');
const languageLoading = atom<boolean>({
  key: 'languageLoading',
  default: false,
});

export default { lang, languageLoading };

import en from './en';
import zh from './cn';
import es from './es';
import tr from './tr';
import kr from './kr';
import ICON_EN from '@/assets/images/en.svg';
import ICON_ZH from '@/assets/images/zh.svg';
import ICON_TR from '@/assets/images/tr.svg';
import ICON_ES from '@/assets/images/es.svg';
import ICON_KR from '@/assets/images/kr.svg';

export const Languages = [
    {
        key: 'en',
        svg: ICON_EN
    },
    {
        key: 'zh',
        svg: ICON_ZH
    },
    {
        key: 'es',
        svg: ICON_ES
    },
    {
        key: 'tr',
        svg: ICON_TR
    },
    {
        key: 'kr',
        svg: ICON_KR
    }
];

export default {
    en: en,
    zh: zh,
    kr: kr
};

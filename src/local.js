const LANG = 'fa'; // static

const DIR = LANG === 'fa' ? 'rtl' : 'ltr';

const WORDS = {
    'fa' : {
        'Open Loop Bode Diagram': 'دیاگرام بد حلقه باز',
        'Plant Bode Diagram': 'دیاگرام بد پلنت',
        'Controller Parameters': 'پارامترهای کنترلر',
        'Plant Parameters': 'پارامترهای پلنت',
        'Controller Selection': 'انتخاب کنترلر',
        'Plant Selection': 'انتخاب پلنت',
        'Closed-loop Step Response': 'پاسخ پلهٔ حلقه بسته',
        'Plant Step Response': 'پاسخ پلهٔ پلنت',
        'Closed-loop Pole-zero Plot': 'دیاگرام صفر و قطب حلقه بسته',
        'Plant Pole-zero Plot': 'دیاگرام صفر و قطب پلنت',

        'Select...': 'انتخاب کنید...',

        'First Order': 'مرتبه اول',
        'First Order with Gain': 'مرتبه اول گین دار',
        'First Order with Zero': 'مرتبه اول صفر دار',
        'Integrator': 'انتگرال‌گیر',
        'Second Order': 'مرتبه دو',
        'Second Order with Zero': 'مرتبه دو صفر دار',
        'Third Order': 'مرتبه سه',
        'Mass-spring': 'جرم و فنر',
        'Pendulum (Linear Approx.)': 'پاندول (تقریب خطی)',
        'Reverse Pendulum (Linear Approx.)': 'پاندول معکوس (تقریب خطی)',

        'Propotional': 'تناسبی (P)',
        'Lead': 'پیش‌فاز',
        'Lag': 'پس‌فاز',
        'Lead-lag': 'پیش‌فاز-پس‌فاز',
        'Non-unity Feedback': 'فیدبک غیر واحد',

        'Maximum Overshoot:': 'حداکثر فراجهش:',
        'Rise Time:': 'زمان صعود:',
        'Settling Time:': 'زمان نشست:',
        'Steady State Error:': 'خطای حالت ماندگار:',
        'Unstable': 'ناپایدار',
    }
}

const LOCAL = function(key) {
    if (LANG === 'en') {
        return key; // No conversion needed. // todo: show warning if outside word_list
    } else {
        return WORDS[LANG][key] || key;
    }
}

export {LOCAL, DIR};
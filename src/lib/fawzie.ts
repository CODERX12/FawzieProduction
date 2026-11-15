export const BRAND = {
  name: "Fawzie Recruitment",
  phone: "0711534413",
  phoneRaw: "+254711534413",
  email: "mutuafauziya@gmail.com",
  address: "Jeevan Bharti Building, Harambee Avenue, Starehe, Nairobi, Kenya",
  licence: "",
  licenceUrl: "https://neaims.go.ke/",
};

export const WHATSAPP_LINK = `https://wa.me/${BRAND.phoneRaw.slice(1)}?text=${encodeURIComponent("Hello Fawzie Recruitment Agency, I would like to inquire about your services.")}`;

export const CATEGORIES = [
  "Domestic Work", "Construction", "Hospitality", "Healthcare", "Security",
  "Driver / Transport", "Cleaning & Facilities", "Agriculture", "Manufacturing",
  "Retail & Sales", "Engineering", "IT & Technology",
] as const;

export const COUNTRIES = [
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", roles: ["Domestic Work", "Security", "Healthcare", "Driver"] },
  { code: "AE", name: "UAE", flag: "🇦🇪", roles: ["Hospitality", "Construction", "Driver", "Cleaning"] },
  { code: "QA", name: "Qatar", flag: "🇶🇦", roles: ["Construction", "Security", "Hospitality", "Driver"] },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", roles: ["Domestic Work", "Healthcare", "Cleaning"] },
] as const;

export const STATUSES = ["Received", "Reviewing", "Accepted", "Rejected"] as const;
export const PRIVACY_COPY = "I agree to the privacy notice and consent to Fawzie Recruitment collecting my personal data in line with the Kenya Data Protection Act.";

export type Language = "en" | "sw" | "ar";
export type Job = {
  id: string;
  title: string;
  category: string;
  location: string;
  country: string;
  job_type: "Kenya" | "Overseas";
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  description: string;
  requirements: string;
  employer: string;
  posted_at: string;
  is_published: boolean;
  is_sample: boolean;
};

export const languageText: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home", "nav.jobs": "Jobs", "nav.seekers": "Job Seekers", "nav.employers": "Employers",
    "nav.migration": "Safe Migration", "nav.help": "Get Help", "nav.about": "About", "nav.contact": "Contact",
    "nav.register": "Register", "hero.title": "Work you can trust, here and abroad",
    "hero.subtitle": "A Kenyan recruitment agency connecting you to opportunities locally and in the Gulf — with safety and fairness in mind.",
    "cta.apply": "Apply Now", "cta.browse": "Browse Jobs", "cta.register": "Register as a Job Seeker",
    "cta.hire": "Request Workers", "cta.help": "Get Urgent Help", "help.title": "In trouble abroad? We are here for you — 24/7.",
    "common.back": "Back", "common.next": "Next", "common.privacy": PRIVACY_COPY,
    "footer.tagline": "Connecting Kenyan workers with local and overseas opportunities.",
  },
  sw: {
    "nav.home": "Mwanzo", "nav.jobs": "Kazi", "nav.seekers": "Watafuta Kazi", "nav.employers": "Waajiri",
    "nav.migration": "Uhamiaji Salama", "nav.help": "Pata Msaada", "nav.about": "Kuhusu", "nav.contact": "Wasiliana",
    "nav.register": "Jisajili", "hero.title": "Kazi unayoaminisha, hapa na nje ya nchi",
    "hero.subtitle": "Wakala wa uajiri wa Kenya anayekutanisha na kazi nzuri nchini na Ghuba — kwa usalama na haki.",
    "cta.apply": "Omba Sasa", "cta.browse": "Tafuta Kazi", "cta.register": "Jisajili kama Mtafuta Kazi",
    "cta.hire": "Omba Wafanyakazi", "cta.help": "Pata Msaada wa Haraka", "help.title": "Una matatizo nje ya nchi? Tuko hapa kukusaidia — saa 24/7.",
    "common.back": "Nyuma", "common.next": "Inayofuata", "common.privacy": "Nakubali notisi ya faragha na kuruhusu Fawzie Recruitment kukusanya data yangu kulingana na Sheria ya Ulinzi wa Data ya Kenya.",
    "footer.tagline": "Wakala wa ajira anayeunganisha Wakenya na nafasi za kazi nchini na nje ya nchi.",
  },
  ar: {
    "nav.home": "الرئيسية", "nav.jobs": "الوظائف", "nav.seekers": "الباحثون عن عمل", "nav.employers": "أصحاب العمل",
    "nav.migration": "الهجرة الآمنة", "nav.help": "احصل على المساعدة", "nav.about": "من نحن", "nav.contact": "اتصل بنا",
    "nav.register": "سجل الآن", "hero.title": "عمل يمكنك الوثوق به، هنا وفي الخارج",
    "hero.subtitle": "وكالة توظيف كينية تربطك بفرص محلية وفي الخليج مع مراعاة السلامة والإنصاف.",
    "cta.apply": "تقدم الآن", "cta.browse": "تصفح الوظائف", "cta.register": "سجل كباحث عن عمل",
    "cta.hire": "اطلب عمالاً", "cta.help": "احصل على مساعدة عاجلة", "help.title": "هل تواجه مشكلة في الخارج؟ نحن هنا من أجلك — على مدار الساعة.",
    "common.back": "رجوع", "common.next": "التالي", "common.privacy": "أوافق على إشعار الخصوصية وأسمح لـ Fawzie Recruitment بجمع بياناتي الشخصية وفقاً لقانون حماية البيانات الكيني.",
    "footer.tagline": "وكالة توظيف كينية تربط العمال بفرص محلية وخارجية.",
  },
};
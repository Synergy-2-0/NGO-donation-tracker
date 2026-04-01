import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      navbar: {
        dashboard: "Dashboard",
        campaigns: "Campaigns",
        pledges: "My Pledges",
        history: "Donation History",
        profile: "My Profile",
        settings: "Settings HUB",
        logout: "LOGOUT",
        language: "Language",
        overview: "Overview",
        finance_summary: "Finance Summary",
        recent_activity: "Recent Activity",
        partnerships: "Partnerships",
        my_agreements: "My Agreements",
        partner_list: "Partner List",
        account: "Account",
        donors: "Donors",
        donor_list: "Donor List",
        all_pledges: "All Pledges",
        donor_data: "Donor Data",
        missions: "Missions",
        mission_registry: "Mission Registry",
        partners: "Partners",
        pending_access: "Pending Access",
        managed_agreements: "Managed Agreements",
        security_hub: "Security HUB",
        giving: "Giving",
        active_agreements: "Active Agreements",
        manage_projects: "Manage Projects",
        admin_console: "Admin Console",
        ngo_ops: "NGO Operations",
        partner_portal: "Partner Portal",
        donor_dash: "Donor Dashboard",
        roles: {
          admin: "System Admin",
          ngo_admin: "Administrator",
          partner: "Official Partner",
          donor: "Verified Donor"
        }
      },
      public_navbar: {
        mission: "our mission",
        causes: "causes",
        transparency: "transparency",
        how_it_works: "how it works",
        impact_hub: "impact hub",
        partner_list: "partner list",
        login: "Login",
        sign_in: "Sign In",
        get_started: "Get Started",
        discard: "Discard",
        admin_portal: "Admin Portal",
        ngo_dashboard: "NGO Dashboard",
        donor_dashboard: "Donor Dashboard"
      },
      dashboard: {
        welcome: "Welcome back",
        tagline: "Your humanitarian capital is actively supporting verified missions.",
        header: {
          badge: "DONOR HUB",
          security: "Institutional Grade Security Authorized"
        },
        stats: {
           asset_impact: "Asset Impact",
           verified_deployments: "Verified Deployments",
           active_missions: "Active Missions",
           community_nodes: "Community Support Nodes",
           strategy_pledges: "Strategy Pledges",
           recurring_commitments: "Recurring Commitments",
           trust_ranking: "Trust Ranking",
           supporter_integrity: "Supporter Integrity"
        },
        timeline: {
          title: "CAPITAL TIMELINE",
          subtitle: "Historical data nodes for your philanthropic asset deployment.",
          cycle: "6 MONTH CYCLE"
        },
        insights: {
          title: "Donor Insights",
          hub: "COMMUNITY INFORMATION HUB",
          live: "LIVE ANALYSIS",
          prediction: "PREDICTION HUB",
          recommendation: "RECOMMENDATION HUB",
          match: "{{percent}}% MATCH"
        }
      }
    }
  },
  si: {
    translation: {
      navbar: {
        dashboard: "පුවරුව",
        campaigns: "ව්‍යාපාර",
        pledges: "මගේ ප්‍රතිඥා",
        history: "පරිත්‍යාග ඉතිහාසය",
        profile: "මගේ පැතිකඩ",
        settings: "සැකසුම් මධ්‍යස්ථානය",
        logout: "පිටවීම",
        language: "භාෂාව",
        overview: "දළ විශ්ලේෂණය",
        finance_summary: "මූල්‍ය සාරාංශය",
        recent_activity: "මෑත කාලීන ක්‍රියාකාරකම්",
        partnerships: "හවුල්කාරිත්වයන්",
        my_agreements: "මගේ ගිවිසුම්",
        partner_list: "හවුල්කරුවන්ගේ ලැයිස්තුව",
        account: "ගිණුම",
        donors: "පරිත්‍යාගශීලීන්",
        donor_list: "පරිත්‍යාගශීලීන්ගේ ලැයිස්තුව",
        all_pledges: "සියලුම ප්‍රතිඥා",
        donor_data: "පරිත්‍යාගශීලී දත්ත",
        missions: "මෙහෙයුම්",
        mission_registry: "මෙහෙයුම් ලේඛකාධිකාරය",
        partners: "හවුල්කරුවන්",
        pending_access: "අනුමත වෙමින් පවතින",
        managed_agreements: "කළමනාකරණය කළ ගිවිසුම්",
        security_hub: "ආරක්ෂක මධ්‍යස්ථානය",
        giving: "පරිත්‍යාග",
        active_agreements: "ක්‍රියාකාරී ගිවිසුම්",
        manage_projects: "ව්‍යාපෘති කළමනාකරණය",
        admin_console: "පරිපාලන කොන්සෝලය",
        ngo_ops: "NGO මෙහෙයුම්",
        partner_portal: "හවුල්කාර ද්වාරය",
        donor_dash: "පරිත්‍යාගශීලී පුවරුව",
        roles: {
          admin: "පද්ධති පරිපාලක",
          ngo_admin: "පරිපාලක",
          partner: "නිල හවුල්කරු",
          donor: "සත්‍යාපිත පරිත්‍යාගශීලී"
        }
      },
      public_navbar: {
        mission: "අපගේ මෙහෙවර",
        causes: "හේතු",
        transparency: "විනිවිදභාවය",
        how_it_works: "එය ක්‍රියා කරන ආකාරය",
        impact_hub: "බලපෑමේ මධ්‍යස්ථානය",
        partner_list: "හවුල්කරුවන්ගේ ලැයිස්තුව",
        login: "පිවිසෙන්න",
        sign_in: "ඇතුල් වන්න",
        get_started: "ආරම්භ කරන්න",
        discard: "අත්හරින්න",
        admin_portal: "පරිපාලන ද්වාරය",
        ngo_dashboard: "NGO පුවරුව",
        donor_dashboard: "පරිත්‍යාගශීලී පුවරුව"
      },
      dashboard: {
        welcome: "නැවත සාදරයෙන් පිළිගනිමු",
        tagline: "ඔබේ මානුෂීය ප්‍රාග්ධනය සත්‍යාපනය කළ ව්‍යාපාර සඳහා ක්‍රියාකාරීව දායක වේ.",
        header: {
          badge: "පරිත්‍යාග මධ්‍යස්ථානය",
          security: "ආයතනික මට්ටමේ ආරක්‍ෂාව සහතික කර ඇත"
        },
        stats: {
           asset_impact: "ප්‍රාග්ධන බලපෑම",
           verified_deployments: "සත්‍යාපිත යෙදවීම්",
           active_missions: "ක්‍රියාකාරී මෙහෙයුම්",
           community_nodes: "ප්‍රජා සහය ඒකක",
           strategy_pledges: "උපායමාර්ගික ප්‍රතිඥා",
           recurring_commitments: "නැවත සිදුවන කැපවීම්",
           trust_ranking: "විශ්වාසනීය ශ්‍රේණිගත කිරීම",
           supporter_integrity: "ආධාරකරුගේ අවංකභාවය"
        },
        timeline: {
          title: "ප්‍රාග්ධන කාලරාමුව",
          subtitle: "ඔබේ පරිත්‍යාගශීලී ප්‍රාග්ධන යෙදවීම සඳහා වන ඓතිහාසික දත්ත.",
          cycle: "මාස 6 ක චක්‍රය"
        },
        insights: {
          title: "පරිත්‍යාගශීලී අවබෝධය",
          hub: "ප්‍රජා තොරතුරු මධ්‍යස්ථානය",
          live: "සජීවී විශ්ලේෂණය",
          prediction: "අනාවැකි මධ්‍යස්ථානය",
          recommendation: "නිර්දේශ මධ්‍යස්ථානය",
          match: "{{percent}}% ගැලපීම"
        }
      }
    }
  },
  ta: {
    translation: {
      navbar: {
        dashboard: "டாஷ்போர்டு",
        campaigns: "பிரச்சாரங்கள்",
        pledges: "என் சபதங்கள்",
        history: "நன்கொடை வரலாறு",
        profile: "என் சுயவிவரம்",
        settings: "அமைப்பு மையம்",
        logout: "வெளியேறு",
        language: "மொழி",
        overview: "மேலோட்டம்",
        finance_summary: "நிதிச் சுருக்கம்",
        recent_activity: "சமீபத்திய செயல்பாடு",
        partnerships: "கூட்டுறவுகள்",
        my_agreements: "என் ஒப்பந்தங்கள்",
        partner_list: "பங்குதாரர் பட்டியல்",
        account: "கணக்கு",
        donors: "நன்கொடையாளர்கள்",
        donor_list: "நன்கொடையாளர் பட்டியல்",
        all_pledges: "அனைத்து சபதங்கள்",
        donor_data: "நன்கொடையாளர் தரவு",
        missions: "பணிகள்",
        mission_registry: "பணிப் பதிவேடு",
        partners: "பங்குதாரர்கள்",
        pending_access: "நிலுவையில் உள்ள அணுகல்",
        managed_agreements: "நிர்வகிக்கப்பட்ட ஒப்பந்தங்கள்",
        security_hub: "பாதுகாப்பு மையம்",
        giving: "நன்கொடை",
        active_agreements: "செயலில் உள்ள ஒப்பந்தங்கள்",
        manage_projects: "திட்டங்களை நிர்வகி",
        admin_console: "நிர்வாக மையம்",
        ngo_ops: "NGO செயல்பாடுகள்",
        partner_portal: "பங்குதாரர் தளம்",
        donor_dash: "நன்கொடையாளர் டாஷ்போர்டு",
        roles: {
          admin: "கணினி நிர்வாகி",
          ngo_admin: "நிர்வாகி",
          partner: "அதிகாரப்பூர்வ பங்குதாரர்",
          donor: "சரிபார்க்கப்பட்ட நன்கொடையாளர்"
        }
      },
      public_navbar: {
        mission: "எங்கள் நோக்கம்",
        causes: "காரணங்கள்",
        transparency: "வெளிப்படைத்தன்மை",
        how_it_works: "செயல்முறை",
        impact_hub: "தாக்க மையம்",
        partner_list: "பங்குதாரர் பட்டியல்",
        login: "உள்நுழை",
        sign_in: "உள்நுழைக",
        get_started: "தொடங்கவும்",
        discard: "கைவிடு",
        admin_portal: "நிர்வாக போர்டல்",
        ngo_dashboard: "NGO டாஷ்போர்டு",
        donor_dashboard: "நன்கொடையாளர் டாஷ்போர்டு"
      },
      dashboard: {
        welcome: "மீண்டும் வருக",
        tagline: "உங்கள் மனிதாபிமான மூலதனம் சரிபார்க்கப்பட்ட பணிகளுக்கு தீவிரமாக பங்களிக்கிறது.",
        header: {
          badge: "நன்கொடையாளர் மையம்",
          security: "நிறுவன தர பாதுகாப்பு அங்கீகரிக்கப்பட்டுள்ளது"
        },
        stats: {
           asset_impact: "மூலதன தாக்கம்",
           verified_deployments: "சரிபார்க்கப்பட்ட வரிசைப்படுத்தல்கள்",
           active_missions: "செயலில் உள்ள பணிகள்",
           community_nodes: "சமூக ஆதரவு மையங்கள்",
           strategy_pledges: "மூலோபாய சபதங்கள்",
           recurring_commitments: "தொடர்ச்சியான அர்ப்பணிப்புகள்",
           trust_ranking: "நம்பிக்கை தரவரிசை",
           supporter_integrity: "ஆதரவாளர் நேர்மை"
        },
        timeline: {
          title: "மூலதன காலவரிசை",
          subtitle: "உங்கள் நிதிச் சொத்து வரிசைப்படுத்தலுக்கான வரலாற்றுத் தரவு அலகுகள்.",
          cycle: "6 மாத சுழற்சி"
        },
        insights: {
          title: "நன்கொடையாளர் நுண்ணறிவு",
          hub: "சமூக தகவல் மையம்",
          live: "நேரடி பகுப்பாய்வு",
          prediction: "கணிப்பு மையம்",
          recommendation: "பரிந்துரை மையம்",
          match: "{{percent}}% பொருத்தம்"
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      navbar: {
        dashboard: "Intelligence Hub",
        campaigns: "Missions",
        pledges: "Strategic Pledges",
        history: "Impact History",
        profile: "Supporter Profile",
        settings: "Global Settings",
        logout: "LOGOUT",
        language: "Language",
        overview: "Overview",
        finance_summary: "Finance Summary",
        recent_activity: "Recent Activity",
        partnerships: "Partnerships",
        my_agreements: "My Agreements",
        partner_list: "Partner List",
        account: "Corporate Account",
        donors: "Support Registry",
        donor_list: "Institutional Supporter List",
        all_pledges: "All Commitments",
        donor_data: "Supporter Records",
        missions: "Projects",
        mission_registry: "Project Directory",
        partners: "Partners",
        pending_access: "Reviewing Requests",
        managed_agreements: "Managed Agreements",
        security_hub: "Security Center",
        giving: "My Giving",
        active_agreements: "Active Partners",
        manage_projects: "Manage Projects",
        admin_console: "Control Panel",
        ngo_ops: "NGO Operations",
        partner_portal: "Partner Center",
        donor_dash: "Supporter Dashboard",
        verification_center: "Verification Center",
        milestone_registry: "Impact Progress",
        corporate_profile: "Organization Profile",
        ai_matchmaker: "Matchmaking",
        csr_hub: "Community",
        roles: {
          admin: "Admin",
          ngo_admin: "Administrator",
          partner: "Official Partner",
          donor: "Verified Supporter"
        }
      },
      public_navbar: {
        mission: "Our Mission",
        causes: "Causes",
        transparency: "Transparency",
        how_it_works: "How it Works",
        impact_hub: "Impact Center",
        partner_list: "Partner List",
        login: "Authorize",
        sign_in: "Establish Access",
        get_started: "Begin Mission",
        discard: "Discard",
        admin_portal: "Admin Panel",
        ngo_dashboard: "Admin Dashboard",
        donor_dashboard: "My Dashboard",
        partner_dashboard: "Partner Center"
      },
      sidebar: {
        sections: {
          management: "MANAGEMENT CENTER",
          partnership_core: "ALLIANCES",
          intel_ai: "COMMUNITY INTELLIGENCE",
          institutional: "INSTITUTIONAL MEMBER",
          overview: "Mission Overview",
          donors: "Supporters",
          missions: "Projects",
          partners: "Organizations",
          campaigns: "Causes",
          giving: "My Giving",
          account: "Account"
        },
        items: {
          operations_log: "Activity History",
          collab_missions: "Partner Projects",
          partner_network: "Community Network"
        }
      },
      marketplace: {
        header: {
          badge: "Explore Causes",
          title_1: "Community",
          title_2: "Causes",
          subtitle: "Discover and support verified charities and humanitarian projects."
        },
        search: "Search causes...",
        filter_goal: "Filter by Goal",
        all_goals: "All Goals",
        no_results: "No initiatives found",
        adjust_filters: "Try adjusting your filters or search terms.",
        raised: "Raised",
        goal: "Goal",
        target: "Goal",
        propose_partnership: "Start Partnership",
        support_campaign: "Support Cause",
        view_details: "View Details",
        loading: "Loading active causes..."
      },
      dashboard: {
        welcome: "Philanthropic Overview",
        tagline: "Your verified strategic capital is driving sustainable change across global humanitarian missions.",
        header: {
          badge: "CERTIFIED SUPPORTER",
          security: "Institutional-Grade Security Active"
        },
        stats: {
           asset_impact: "Cumulative Philanthropic Impact",
           verified_deployments: "Verified Capital Deployments",
           active_missions: "Active Strategic Missions",
           community_nodes: "Operational Impact Nodes",
           strategy_pledges: "Strategic Commitments",
           recurring_commitments: "Sustainable Recurring Support",
           trust_ranking: "Institutional Trust Index",
           supporter_integrity: "Supporter Integrity Status",
           active_campaigns: "Live Humanitarian Partners"
        },
        timeline: {
          title: "IMPACT EXECUTION TIMELINE",
          subtitle: "Historical record of verified capital deployment and mission results.",
          cycle: "6-MONTH FISCAL OVERVIEW"
        },
        insights: {
          title: "Supporter Intelligence",
          hub: "ANALYTICS HUB",
          live: "LIVE MISSION ANALYSIS",
          prediction: "IMPACT FORECASTS",
          recommendation: "STRATEGIC MATCHES",
          match: "{{percent}}% ALLIANCE MATCH"
        },
        allocation: {
          title: "Capital Allocation Breakdown",
          subtitle: "Distribution of support across varied humanitarian sectors."
        },
        activity: {
          title: "Recent Impact",
          subtitle: "Your latest actions in the community.",
          view_all: "VIEW FULL HISTORY",
          empty: "Waiting for your first contribution."
        },
        registry: {
          title: "Recent Activity",
          subtitle: "A detailed list of your recent verified contributions.",
          view_full: "VIEW FULL LIST",
          table: {
            protocol_id: "Reference ID",
            mission_title: "Project Title",
            asset_volume: "Amount",
            current_state: "Status",
            system_node: "Category"
          },
          gen_support: "General Fund",
          awaiting: "Waiting for new contributions..."
        },
        pledges_overview: {
          title: "My Commitments",
          subtitle: "Ongoing support for sustainable community impact.",
          manage: "Manage Giving",
          plan_suffix: "Plan",
          gen_sustainable: "General Support",
          impact_level: "Impact Level",
          active_commitment: "Active commitment",
          start_pledge: "Start your first recurring contribution."
        }
      },
      milestones: {
        header_badge: "MISSION MILESTONES",
        institutional: "Mission",
        roadmap: "Roadmap",
        subtitle: "Track the progress of this project and its verified goals.",
        global_hub_desc: "Overview of all active project milestones.",
        progress: "Overall Progress",
        total_volume: "Total Amount",
        partner_node: "Partner",
        mission_node: "Cause",
        filter_all: "ALL",
        filter_pending: "PENDING",
        filter_executing: "EXECUTING",
        filter_completed: "DONE",
        create_milestone: "Add Milestone",
        table_milestones: {
          title: "Step",
          date: "Due Date",
          status: "Status",
          evidence: "Evidence",
          actions: "Actions"
        },
        view_evidence: "VIEW",
        not_uploaded: "NOT UPLOADED",
        empty_title: "No milestones yet.",
        empty_desc: "Add a milestone to start tracking progress.",
        modal: {
          title: "Milestone Details",
          label_title: "Title",
          label_desc: "Description",
          label_date: "Date",
          label_status: "Status",
          submit: "SAVE"
        }
      },
      ngo_dashboard: {
        welcome: "Welcome",
        verification_badge: "PENDING VERIFICATION",
        control_center: "CONTROL CENTER",
        tagline: "Your organization's profile is currently being verified.",
        locked_: "SYSTEM STATUS",
        treasury_analytics: "FINANCIAL OVERVIEW",
        active_projects: "ACTIVE PROJECTS",
        trust_rating: "TRUST RATING",
        total_raised: "TOTAL RECEIVED",
        treasury_balance: "AVAILABLE FUNDS",
        verified_missions: "Verified active projects",
        transparency_score: "Trust & Transparency",
        cumulative_intake: "Total income",
        allocated_projects: "Project Funds",
        view_all_missions: "View All Projects",
        ongoing_operations: "Current Services",
       _campaigns: "Refresh Projects",
        active_campaigns: {
          title: "Active Projects",
          subtitle: "Real-time tracking of your verified initiatives."
        },
        registry_node: "Reference ID",
        goal_performance: "Progress",
        mission_active: "PROJECT ACTIVE",
        view_analytics: "View Reports",
        partnership_proposals: {
          title: "Partnership Requests",
          subtitle: "Potential collaborations currently in review."
        },
        partner_hub: "PARTNER CENTER",
        proposal_id: "Request ID",
        partner_name: "Organization",
        verification_state: "Status",
        view_agreement: "View Agreement",
        awaiting_missions: "Launch your first project to get started.",
        awaiting_partnerships: "No partnership requests at this time."
      },
      finance: {
        registry_title: "Financial Center",
        transparency_hub: "Transparency Center",
        managing_funds: "Fund management",
        gross_income: "Total Received",
        total_allocated: "Distributed Funds",
        unallocated_reserves: "Held Funds",
        allocation_breakdown: "Spending Breakdown",
        by_category: "By Category",
        deployment_log: "Fund Distribution Record",
        audit_: "Verified tracking for every cent",
        allocate_capital: "Distribute Funds",
        date: "Date",
        mission_category: "Cause Category",
        amount_sent: "Amount",
        registry_id: "Record ID"
      },
      home: {
        hero: {
          badge_verified: "VERIFIED HUMANITARIAN REGISTRY",
          badge_active: "{{role}} PORTAL ACTIVE",
          title_welcome: "Welcome back,",
          title_main_1: "Verified Impact.",
          title_main_2: "Strategic Transparency.",
          subtitle: "Connect with the community and support verified local humanitarian projects with absolute clarity and ease.",
          explore_button: "Browse Causes",
          join_button: "Join Today",
          initialize_profile: "Complete Profile →",
          methodology: "How it Works"
        },
        stats: {
          assets: "Funds Distributed",
          milestones: "Project Goals Met",
          agents: "Registered Supporters",
          audit: "Transparency Rating"
        },
        features: {
          badge: "Active System v4.0",
          title_1: "Simple.",
          title_2: "Powerful.",
          feature_1_t: "Verified Partners",
          feature_1_d: "Every organization is carefully checked to ensure your donation is safe and impactful.",
          feature_2_t: "Real-time Updates",
          feature_2_d: "Follow your contribution with live photos and progress reports from the field.",
          feature_3_t: "Smart Giving",
          feature_3_d: "Get suggestions for causes that match your interests and values.",
          feature_4_t: "Secure System",
          feature_4_d: "We use top-tier security to protect your information and your donations."
        },
        causes: {
          badge: "Featured Projects",
          title: "Help Someone Today.",
          view_all: "Browse All Causes"
        },
        cta: {
          title: "Make a Difference ",
          subtitle: "Join our community of supporters dedicated to helping others through transparent giving."
        }
      },
      ai_match: {
        loading: {
          title: "Gathering Community Updates...",
          subtitle: "Analyzing Verified Support Networks v2.4"
        },
        hero: {
          badge: "Smart Support Connection",
          title: "Verified Project Matchmaker",
          subtitle: "Identify the best organizations to support across our global network based on your giving focus areas and community goals."
        },
        grid: {
          synergy: "Match",
          initialize_: "START MATCHING",
          ngo: "Organization"
        },
        map: {
          title: "Impact Map",
          subtitle: "View our global community to identify where your support is needed most.",
          density: "Network Density",
          coverage: "Active Mapping: {{percent}}% coverage",
          expand: "EXPAND MAP"
        },
        reasons: {
          csr: "Aligned with your {{count}} CSR Pillar(s).",
          scale: "Operational alignment with your investment scale."
        },
        errors: {
         _failed: "Failed tohronize mission intelligence."
        }
      },
      partner_dashboard: {
        welcome: "Partner Operational Overview",
        tagline: "Verified partnership management and mission-critical asset distribution.",
        overview_badge: "INSTITUTIONAL DASHBOARD",
        verified_badge: "Verified Institution",
        pending_badge: "Verification Pending",
        manage_settings: "Configure Profile",
        active_agreements: "Live Strategic Alliances",
        pending_requests: "Reviewing Proposals",
        total_contributions: "Cumulative Partnership Funding",
        org_health: "Institutional Integrity",
        partnerships_in_progress: "Active mission alliances",
        awaiting_review: "Proposals in review",
        lifetime_total: "Lifetime support volume",
        verification_level: "Verification Protocol Level",
        recent_activity: "Recent Updates",
        view_all: "View All Support Plans",
        table: {
          campaign: "Cause Project",
          amount: "Agreed Support",
          status: "Status",
          actions: "Actions"
        },
        no_agreements: "No active support plans found.",
        discovery: {
          title: "Explore Campaigns",
          subtitle: "Find active projects in need of funding and propose new partnerships today.",
          cta: "See All Campaigns",
          online: "System Online"
        }
      },
      partner_agreements: {
        header: {
          badge: "Institutional Registry",
          title_1: "Strategic",
          title_2: "Agreements",
          subtitle: "Monitor, manage, and formalize your mission-critical partnerships and financial commitments."
        },
        search_placeholder: "Search institutional registry...",
        table: {
          mission: "Campaign Mission",
          vector: "Support Vector",
          asset: "Asset Value",
          institutional: "Institutional"
        },
        roadmap: "Roadmap",
        subtitle: "Manage and track the execution roadmaps for your verified agreements. Our mission-critical tracking system ensures total accountability.",
        global_hub_desc: "Unified intelligence for all organizational milestones across active missions.",
        progress: "Mission Execution Progress",
        total_volume: "Total Asset Volume",
        partner_node: "Partner",
        mission_node: "Mission",
        filter_all: "ALL LABELS",
        filter_pending: "PENDING",
        filter_executing: "EXECUTING",
        filter_completed: "COMPLETED",
        create_milestone: "New Milestone Deployment",
        empty_title: "No milestones detected for this mission node.",
        empty_desc: "Initialize the roadmap to begin high-fidelity execution tracking.",
        table_milestones: {
          title: "Milestone Protocol",
          date: "Execution Date",
          status: "Current Status",
          evidence: "Verified Evidence",
          actions: "Registry"
        },
        not_uploaded: "NOT UPLOADED",
        view_evidence: "VIEW",
        edit: "Edit Protocol",
        delete: "Terminate",
        modal: {
          title: "Milestone Operation",
          label_title: "Milestone Title",
          label_desc: "Comprehensive Description",
          label_date: "Execution Date",
          label_status: "Status",
          label_evidence: "Evidence File (optional)",
          submit: "AUTHORIZE OPERATION"
        },
        agreement_header: "AGREEMENT CONTEXT",
        agreement_meta: "Metadata identification for the parent execution hub.",
        status: {
          public: "Publicly Visible",
          needs_formalization: "Formalize",
          needs_verification: "Verify & Activate",
          details: "Detailed Intel",
          execution: "Execution Matrix"
        },
        no_data: "No Institutional Agreements Registered.",
        modal_intel: {
          audit_header: "Institutional Audit",
          intelligence_header: "Mission Intelligence",
          no_data: "Institutional mission data not initialized.",
          capital_value: "Capital Value",
          registry_type: "Registry Type",
          system: "system",
          close: "Close Intelligence Brief"
        },
        milestones: {
          header_badge: "Mission Execution",
          title: "Execution Roadmap",
          subtitle: "Track, manage, and verify strategic progress for current humanitarian alliances.",
          progress_label: "Execution Velocity",
          add_step: "Register Execution Step",
          filters: {
            all: "Every Step",
            pending: "Upcoming",
            executing: "In-Progress",
            success: "Accomplished"
          },
          table: {
             step: "Execution Step",
             due: "Target Vector",
             status: "Status",
             actions: "Action Matrix"
          },
          no_steps: "No Execution Steps Registered.",
          modal: {
            add_title: "Initialize Execution Step",
            edit_title: "Calibrate Execution Step",
            title_label: "Step Identity",
            desc_label: "Operational Context",
            due_label: "Target Temporal",
            status_label: "Deployment State",
            evidence_label: "Proof of Execution",
            save: "hronize",
            delete: "Purge"
          }
        },
        pledges: {
          header_badge: "Capital Commitments",
          title: "Strategic Pledges",
          subtitle: "Institutional commitments to future mission support nodes.",
          stats: {
            total: "Total Committed Assets",
            active: "Live Strategic Threads"
          },
          table: {
            campaign: "Target Mission",
            amount: "Committed Amount",
            status: "Audit Level",
            date: "Timestamp"
          },
          no_pledges: "No Strategic Pledges Indexed."
        }
      },
      institutional_agreements: {
        title: "Partnerships",
        subtitle: "Review and manage your active project partnerships.",
        search: "Search missions...",
        create: "START PARTNERSHIP",
        view_details: "VIEW",
        formalize: "FORMALIZE AGREEMENT",
        activate: "ACTIVATE AGREEMENT",
        roadmap: "PROJECT MILESTONES",
        empty: "No active partnerships found.",
        table: {
          id: "ID",
          mission: "Mission",
          partner: "Partner",
          allocation: "Amount",
          state: "Status",
          action: "Actions"
        },
        success: {
          formalized: "Agreement formalized and signed.",
          activated: "Agreement verified and activated."
        },
        error: {
          onboarding: "Partner profile not found. Please complete onboarding.",
          load: "Failed to load partner profile.",
          sign: "Acceptance signature failed.",
          activate: "Activation failed."
        }
      },
      campaign_registry: {
        operational_hub: "Operational",
        title_1: "Mission",
        title_2: "Registry",
        subtitle: "Coordinate, publish, and monitor impact initiatives across the global network.",
        create_button: "Initialize Mission",
        stats: {
          network: "Network Missions",
          active: "Active Status",
          pending: "Pending Drafts",
          impact: "Cumulative Impact"
        },
        filter: {
          placeholder: "Filter missions by title or ID...",
          all: "Every Status",
          proposals: "Proposals Only",
          live: "Live Missions",
          success: "Accomplished",
          closed: "Closed"
        },
        table: {
          identity: "Mission Identity",
          progress: "Target Progress",
          level: "Operational Level",
          actions: "Actions",
          submit: "Submit Registry",
          approve: "Approve",
          details: "Details Index"
        },
        no_results: "No matching missions identified."
      },
      pledge_modal: {
        mission_support: "Support Center",
        title_new: "Start New Support Plan",
        title_edit: "Update Your Support",
        amount_label: "Donation Amount (LKR)",
        frequency_label: "Donation Frequency",
        freq: {
          "one-time": "One-Time",
          monthly: "Monthly",
          quarterly: "Quarterly",
          annually: "Annually"
        },
        gift_suffix: "Support",
        notes_label: "Personal Notes",
        notes_placeholder: "Your message for this donation...",
        start_date: "Support Start Date",
        cancel: "Cancel",
        save_plan: "Update Support",
        create_plan: "Start Support",
        loading_missions: "Finding Active Projects..."
      },
      pledges_page: {
        header_badge: "Impact Support Center",
        title_1: "My Donation",
        title_2: "Dashboard",
        subtitle: "Manage your ongoing support for humanitarian causes. Every contribution is tracked through our Verified Transparency Standards.",
        profile_verification: {
          title: "Profile Verification Required",
          desc: "To start supporting projects and managing your impact, your profile must be fully set up.",
          button: "Complete My Profile"
        },
        no_pledges: {
          title: "No Active Pledges",
          desc: "Explore campaigns to start supporting your first verified humanitarian project."
        },
        card: {
          support_label: "Pledge Support",
          cycle_suffix: "MISSION CYCLE",
          gifts_verified: "Gifts Verified",
          total_given: "Total Given",
          next_support: "Next Support Date",
          stop_button: "Stop Pledge",
          payments_unit: "Payments"
        },
        status: {
          active: "ACTIVE",
          fulfilled: "FULFILLED",
          cancelled: "CANCELLED",
          pending: "PENDING"
        }
      },
      donation_history: {
        header_badge: "Verified Records",
        title_1: "My",
        title_2: "Donations",
        subtitle: "View every contribution you have made. Every donation is verified through our community transparency standards.",
        total_impact_label: "Total Impact",
        profile_verification: {
          title: "Profile Verification",
          desc: "Please finalize your profile to access your donation records and receipts."
        },
        no_history: {
          title: "No Records Found",
          desc: "You haven't made any donations yet. Your impact will be shown here."
        },
        active_commitments: "Active Support Plans",
        impact_registry: "Donation Records",
        card: {
          strategy_suffix: "Plan",
          ref_id: "ID",
          status_label: "Status",
          active_status: "Active",
          method_label: "Method",
          project_label: "Project",
          general_fund: "General Fund",
          receipt: "View Receipt",
          status_verified: "Verified"
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
        verification_center: "සත්‍යාපන මධ්‍යස්ථානය",
        milestone_registry: "සන්ධිස්ථාන ලේඛකාධිකාරය",
        corporate_profile: "ආයතනික පැතිකඩ",
        ai_matchmaker: "AI ගැලපුම්කරු",
        csr_hub: "CSR මධ්‍යස්ථානය",
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
        donor_dashboard: "පරිත්‍යාගශීලී පුවරුව",
        partner_dashboard: "හවුල්කාර පුවරුව"
      },
      sidebar: {
        sections: {
          management: "කළමනාකරණ මධ්‍යස්ථානය",
          partnership_core: "හවුල්කාරිත්ව පදනම",
          intel_ai: "බුද්ධි පද්ධති & AI",
          institutional: "ආයතනික මධ්‍යස්ථානය",
          overview: "දළ විශ්ලේෂණය",
          donors: "පරිත්‍යාගශීලීන්",
          missions: "මෙහෙයුම්",
          partners: "හවුල්කරුවන්",
          campaigns: "ව්‍යාපාර",
          giving: "පරිත්‍යාග",
          account: "ගිණුම"
        },
        items: {
          operations_log: "මෙහෙයුම් ලේඛනය",
          collab_missions: "හවුල්කාරිත්ව මෙහෙයුම්",
          partner_network: "හවුල්කාර ජාලය"
        }
      },
      marketplace: {
        header: {
          badge: "අවස්ථා ගවේෂණය කරන්න",
          title_1: "ව්‍යාපාර",
          title_2: "වෙළඳපොළ",
          subtitle: "සත්‍යාපිත මෙහෙයුම් ව්‍යාපාර සොයාගෙන සහයෝගය දක්වන්න. ඔබ පරිත්‍යාගයක් කරන පුද්ගලයෙකු හෝ උපායමාර්ගික හවුල්කාරිත්වයක් ඇති කර ගන්නා ආයතනයක් වුවද, ඔබේ බලපෑම මෙතැනින් ආරම්භ වේ."
        },
        search: "ව්‍යාපාර සොයන්න...",
        filter_goal: "ඉලක්කය අනුව පෙරන්න",
        all_goals: "සියලු ඉලක්ක",
        no_results: "ව්‍යාපාර කිසිවක් හමු නොවීය",
        adjust_filters: "ඔබේ පෙරහන් හෝ සෙවුම් පද වෙනස් කිරීමට උත්සාහ කරන්න.",
        raised: "එකතු කළ මුදල",
        goal: "ඉලක්කය",
        target: "ඉලක්කය",
        propose_partnership: "හවුල්කාරිත්වයක් යෝජනා කරන්න",
        support_campaign: "ව්‍යාපාරයට සහය දක්වන්න",
        view_details: "සම්පූර්ණ තොරතුරු බලන්න",
        loading: "සක්‍රීය ව්‍යාපාර පූරණය වෙමින් පවතී..."
      },
      dashboard: {
        welcome: "නැවත සාදරයෙන් පිළිගනිමු",
        tagline: "ඔබේ මානුෂීය ප්‍රාග්ධනය සත්‍යාපනය කළ ව්‍යාපාර සඳහා ක්‍රියාකාරීව දායක වේ.",
        header: {
          badge: "පරිත්‍යාග මධ්‍යස්ථානය",
          security: "ආයතනික මට්ටමේ ආරක්‍ෂාව සහතික කර ඇත"
        },
        stats: {
           asset_impact: "මුළු බලපෑම",
           verified_deployments: "සත්‍යාපිත පරිත්‍යාග",
           active_missions: "ක්‍රියාකාරී ව්‍යාපෘති",
           community_nodes: "උපකාරක ස්ථාන",
           strategy_pledges: "කැපවීම්",
           recurring_commitments: "මාසික පරිත්‍යාග",
           trust_ranking: "විශ්වාසනීය ශ්‍රේණිගත කිරීම",
           supporter_integrity: "තත්ත්වය",
           active_campaigns: "ක්‍රියාකාරී සහකරුවන්"
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
        },
        allocation: {
          title: "උපායමාර්ගික බෙදාහැරීමේ දර්ශකය",
          subtitle: "ඔබේ දායකත්ව කළඹ තුළ ඇති මෙහෙයුම් විවිධත්වය."
        },
        activity: {
          title: "මෑත කාලීන මෙහෙයුම්",
          subtitle: "ඔබේ පරිත්‍යාග ඉතිහාසයේ අවසාන දත්ත ඒකක.",
          view_all: "සම්පූර්ණ ඉතිහාසය බලන්න",
          empty: "පළමු මෙහෙයුම් දත්ත ඒකකය ස්ථාපනය කරන තෙක් රැඳී සිටින්න."
        },
        registry: {
          title: "මෑත කාලීන බලපෑම් ලේඛනය",
          subtitle: "ඔබේ අවසාන බලයලත් ප්‍රාග්ධන ප්‍රවාහයන්ගේ සවිස්තරාත්මක සමමුහුර්තකරණය.",
          view_full: "සම්පූර්ණ ලේඛනය බලන්න",
          table: {
            protocol_id: "අනුක්‍රමික අංකය",
            mission_title: "ව්‍යාපෘතිය",
            asset_volume: "පරිත්‍යාගය",
            current_state: "තත්ත්වය",
            system_node: "විස්තර"
          },
          gen_support: "පොදු සහය බෙදා හැරීම",
          awaiting: "නව ප්‍රාග්ධන බලමුලු ගැන්වීමේ ඒකක අපේක්ෂාවෙන්..."
        },
        pledges_overview: {
          title: "උපායමාර්ගික ප්‍රතිඥා",
          subtitle: "තිරසාර මානුෂීය බලපෑමක් ඇති කරන අඛණ්ඩ කැපවීම්.",
          manage: "ප්‍රතිඥා කළමනාකරණය කරන්න",
          plan_suffix: "සැලැස්ම",
          gen_sustainable: "පොදු තිරසාර සහය",
          impact_level: "බලපෑමේ මට්ටම",
          active_commitment: "සක්‍රීය කැපවීම",
          start_pledge: "ඔබේ පළමු තිරසාර උපායමාර්ගික ප්‍රතිඥාව ආරම්භ කරන්න."
        }
      },
      milestones: {
        header_badge: "ව්‍යාපෘති ප්‍රගතිය",
        institutional: "ව්‍යාපෘති",
        roadmap: "සන්ධිස්ථාන",
        subtitle: "මානුෂීය ව්‍යාපෘතිවල ප්‍රගතිය නිරීක්ෂණය සහ කළමනාකරණය කරන්න.",
        global_hub_desc: "සක්‍රීය ව්‍යාපෘතිවල සියලු ප්‍රගති වාර්තා එකම තැනකින්.",
        progress: "ව්‍යාපෘති ප්‍රගතිය",
        total_volume: "මුළු අරමුදල",
        partner_node: "සහකරු ආයතනය",
        mission_node: "ව්‍යාපෘති ඉලක්කය",
        filter_all: "සියල්ල",
        filter_pending: "ඉදිරියට",
        filter_executing: "සිදු වෙමින් පවතී",
        filter_completed: "අවසන්",
        create_milestone: "නව සන්ධිස්ථානයක් එක් කරන්න",
        table_milestones: {
          title: "සන්ධිස්ථානය",
          date: "දිනය",
          status: "තත්ත්වය",
          evidence: "සාක්ෂි",
          actions: "ක්‍රියාකාරකම්"
        },
        view_evidence: "බලන්න",
        not_uploaded: "එක් කර නැත",
        empty_title: "මෙම ව්‍යාපෘතිය සඳහා තවම සන්ධිස්ථාන නොමැත.",
        empty_desc: "ප්‍රගතිය බැලීමට සන්ධිස්ථානයක් එක් කරන්න.",
        modal: {
          title: "සන්ධිස්ථාන විස්තර",
          label_title: "නම",
          label_desc: "විස්තරය",
          label_date: "දිනය",
          label_status: "තත්ත්වය",
          submit: "සුරකින්න"
        }
      },
      ngo_dashboard: {
        welcome: "සාදරයෙන් පිළිගනිමු",
        verification_badge: "සත්‍යාපනය වෙමින් පවතින මධ්‍යස්ථානය",
        control_center: "ආයතනික පාලන මධ්‍යස්ථානය",
        tagline: "ඔබේ ආයතනය දැනට උසස් මට්ටමේ විගණනයකට භාජනය වෙමින් පවතී.",
        locked_: "සීමිත සමමුහුර්තකරණය ආරම්භ කරන්න",
        treasury_analytics: "භාණ්ඩාගාර විශ්ලේෂණ",
        active_projects: "ක්‍රියාකාරී ව්‍යාපෘති",
        trust_rating: "විශ්වාසනීය ශ්‍රේණිගත කිරීම",
        total_raised: "එකතු කරන ලද මුළු මුදල",
        treasury_balance: "භාණ්ඩාගාර ශේෂය",
        verified_missions: "සත්‍යාපිත මෙහෙයුම්",
        transparency_score: "විනිවිදභාවයේ ලකුණු",
        cumulative_intake: "මුළු දායකත්වය",
        allocated_projects: "පවරන ලද ව්‍යාපෘති",
        view_all_missions: "සියලුම මෙහෙයුම් බලන්න",
        ongoing_operations: "පවතින මෙහෙයුම්",
       _campaigns: "ව්‍යාපාර සමමුහුර්ත කරන්න",
        active_campaigns: {
          title: "සක්‍රීය ව්‍යාපාර",
          subtitle: "ඔබේ සත්‍යාපිත මානුෂීය මුලපිරීම් පිළිබඳ තත්‍ය කාලීන නිරීක්ෂණය."
        },
        registry_node: "ලේඛන ඒකකය",
        goal_performance: "ඉලක්ක ක්‍රියාකාරිත්වය",
        mission_active: "මෙහෙයුම සක්‍රීයයි",
        view_analytics: "විශ්ලේෂණය බලන්න",
        partnership_proposals: {
          title: "හවුල්කාරිත්ව යෝජනා",
          subtitle: "වර්තමාන ආයතනික ක්‍රියාවලියේ පවතින උපායමාර්ගික සහයෝගීතාවයන්."
        },
        partner_hub: "හවුල්කාර මධ්‍යස්ථානය",
        proposal_id: "යෝජනා හැඳුනුම්පත",
        partner_name: "හවුල්කරුගේ නම",
        verification_state: "සත්‍යාපන තත්ත්වය",
        view_agreement: "ගිවිසුම බලන්න",
        awaiting_missions: "ඔබේ පළමු ආයතනික මෙහෙයුම දියත් කරන තෙක් රැඳී සිටින්න.",
        awaiting_partnerships: "මේ මොහොතේ කිසිදු ක්‍රියාකාරී උපායමාර්ගික හවුල්කාරිත්වයක් නොමැත."
      },
      finance: {
        registry_title: "NGO මූල්‍ය ලේඛකාධිකාරය",
        transparency_hub: "මූල්‍ය විනිවිදභාවයේ මධ්‍යස්ථානය",
        managing_funds: "මූල්‍ය කළමනාකරණය",
        gross_income: "මුළු ආදායම",
        total_allocated: "මුළු වෙන් කිරීම්",
        unallocated_reserves: "වෙන් නොකළ සංචිත",
        allocation_breakdown: "වෙන් කිරීම් විශ්ලේෂණය",
        by_category: "වර්ගය අනුව",
        deployment_log: "ප්‍රාග්ධන යෙදවීම් ලේඛනය",
        audit_: "ක්ෂේත්‍ර මෙහෙයුම් සමඟ විගණන සමමුහුර්තකරණය",
        allocate_capital: "ප්‍රාග්ධනය වෙන් කරන්න",
        date: "දිනය",
        mission_category: "මෙහෙයුම් වර්ගය",
        amount_sent: "යැවූ මුදල",
        registry_id: "ලේඛන අංකය"
      },
      home: {
        hero: {
          badge_verified: "සත්‍යාපිත පුණ්‍ය වේදිකාව",
          badge_active: "{{role}} ද්වාරය ක්‍රියාකාරීයි",
          title_welcome: "නැවත සාදරයෙන් පිළිගනිමු,",
          title_main_1: "නවීන පරිත්‍යාග.",
          title_main_2: "පූර්ණ විශ්වාසය.",
          subtitle: "ගෝලීය ප්‍රාග්ධනය සහ සෘජු දේශීය මානුෂීය බලපෑම අතර පරතරය පියවීම සඳහා විමධ්‍යගත විනිවිදභාවයේ ප්‍රොටෝකෝල භාවිතා කිරීම. සත්‍යාපිත ආයතනික අඛණ්ඩතාව.",
          explore_button: "හේතු ගවේෂණය කරන්න",
          join_button: "මෙහෙයුමට එක්වන්න",
          initialize_profile: "පැතිකඩ ආරම්භ කරන්න →",
          methodology: "අපගේ ක්‍රමවේදය"
        },
        stats: {
          assets: "සමමුහුර්ත කළ වත්කම්",
          milestones: "දර්ශකගත කළ බලපෑම් සන්ධිස්ථාන",
          agents: "උපායමාර්ගික ගෝලීය නියෝජිතයන්",
          audit: "විනිවිදභාවය විගණන ශ්‍රේණිය"
        },
        features: {
          badge: "මෙහෙයුම් ප්‍රොටෝකෝලය v4.0",
          title_1: "සෘජු බලය.",
          title_2: "විශ්වීය මධ්‍යස්ථානය.",
          feature_1_t: "සත්‍යාපිත NGO",
          feature_1_d: "මෙහෙයුම් විශිෂ්ටත්වය සහ ඉහළ විශ්වාසනීය ලකුණු සහතික කිරීම සඳහා සෑම හවුල්කරුවෙකුම බහු-අදියර සත්‍යාපනයකට භාජනය වේ.",
          feature_2_t: "සජීවී ලුහුබැඳීම",
          feature_2_d: "තත්‍ය කාලීන සන්ධිස්ථාන යාවත්කාලීන කිරීම් සහ ඡායාරූප සාක්ෂි හරහා ඔබේ දායකත්වය ක්ෂේත්‍රයට ළඟා වන ආකාරය නරඹන්න.",
          feature_3_t: "උපායමාර්ගික AI",
          feature_3_d: "ඔබේ වටිනාකම්වලට ගැලපෙන පරිදි පුද්ගලීකරණය කළ මානුෂීය අවබෝධයක් සහ පරිත්‍යාග නිර්දේශ ලබා ගන්න.",
          feature_4_t: "ආරක්ෂිත ද්වාරය",
          feature_4_d: "ගෝලීය ආරක්ෂාව සහ දේශීය වේගය සහතික කරමින් සියලුම ප්‍රාග්ධන මාරු කිරීම් සඳහා කර්මාන්ත සම්මත සංකේතනය.",
        },
        causes: {
          badge: "ක්‍රියාකාරී මෙහෙයුම් ලේඛකාධිකාරය",
          title: "වත්මන් මුලපිරීම්.",
          view_all: "සියලුම ලේඛන දර්ශකය බලන්න"
        },
        cta: {
          title: "පරිවර්තනය වීමට සූදානම්ද?",
          subtitle: "පූර්ණ විනිවිදභාවය සහ සෘජු ක්‍රියාමාර්ග සඳහා කැප වූ සත්‍යාපිත ගෝලීය පරිත්‍යාගශීලීන්ගේ ජාලයකට එක්වන්න."
        }
      },
      ai_match: {
        loading: {
          title: "මෙහෙයුම් බුද්ධි මධ්‍යස්ථානය සමමුහුර්ත වෙමින් පවතී...",
          subtitle: "හිමිකාර සහජීවන ඇල්ගොරිතම v2.4 ක්‍රියාත්මක වේ"
        },
        hero: {
          badge: "වෙලඳපොලට සුදානම් මෙහෙයුම් ගැලපුම් මධ්‍යස්ථානය සමමුහුර්තයි",
          title: "AI සහජීවන ගැලපුම්කරු",
          subtitle: "ඔබේ CSR අවධානය යොමු කළ ක්ෂේත්‍ර සහ ප්‍රාග්ධන යෙදවීමේ ඉලක්ක මත පදනම්ව ගෝලීය ජාලය පුරා ඉහළ සහජීවනයක් සහිත NGO සහයෝගීතා හඳුනා ගන්න."
        },
        grid: {
          synergy: "සහජීවනය",
          initialize_: "සමමුහුර්තකරණය ආරම්භ කරන්න",
          ngo: "NGO"
        },
        map: {
          title: "භූ-විනිවිදභාවයේ මධ්‍යස්ථානය",
          subtitle: "ලොජිස්ටික් හිඩැස් සහ මෙහෙයුම් අවස්ථා හඳුනා ගැනීමට ගෝලීය මානුෂීය භූ දර්ශනය පරීක්ෂා කරන්න.",
          density: "ජාල ඝනත්වය",
          coverage: "ක්‍රියාකාරී සිතියම්ගත කිරීම: {{percent}}% ආවරණය",
          expand: "එන්ජිම පුළුල් කරන්න"
        },
        reasons: {
          csr: "ඔබේ CSR අංශ {{count}} ක් සමඟ අනුකූල වේ.",
          scale: "ඔබේ ආයෝජන පරිමාණය සමඟ මෙහෙයුම් අනුකූලතාවය."
        },
        errors: {
         _failed: "මෙහෙයුම් බුද්ධිය සමමුහුර්ත කිරීමට අපොහොසත් විය."
        }
      },
      partner_dashboard: {
        welcome: "ආයතනික දළ විශ්ලේෂණය",
        tagline: "ඔබේ උපායමාර්ගික හවුල්කාරිත්වයන් සහ මානුෂීය ප්‍රාග්ධනය යෙදවීම.",
        overview_badge: "හවුල්කාර දළ විශ්ලේෂණය",
        verified_badge: "සත්‍යාපිත ගිණුම",
        pending_badge: "ගිණුම අනුමත වෙමින් පවතී",
        manage_settings: "සැකසුම් කළමනාකරණය",
        active_agreements: "ක්‍රියාකාරී ගිවිසුම්",
        pending_requests: "ප්‍රතිචාර නොදුන් ඉල්ලීම්",
        total_contributions: "මුළු දායකත්වය",
        org_health: "ආයතනික සෞඛ්‍යය",
        partnerships_in_progress: "හවුල්කාරිත්වයන් ක්‍රියාත්මක වෙමින් පවතී",
        awaiting_review: "විමර්ශනය අපේක්ෂිතයි",
        lifetime_total: "මුළු පරිත්‍යාග එකතුව",
        verification_level: "සත්‍යාපන මට්ටම",
        recent_activity: "මෑත ක්‍රියාකාරකම් මධ්‍යස්ථානය",
        view_all: "සියලුම ගිවිසුම් බලන්න",
        table: {
          campaign: "ව්‍යාපාර මෙහෙයුම",
          amount: "එකඟ වූ මුදල",
          status: "තත්ත්වය",
          actions: "ක්‍රියාකාරකම් මධ්‍යස්ථානය"
        },
        no_agreements: "කිසිදු ගිවිසුමක් හමු නොවීය.",
        discovery: {
          title: "ව්‍යාපාර ගවේෂණය කරන්න",
          subtitle: "අරමුදල් අවශ්‍ය ක්‍රියාකාරී ව්‍යාපෘති සොයාගෙන අදම නව හවුල්කාරිත්වයන් යෝජනා කරන්න.",
          cta: "සියලු ව්‍යාපාර බලන්න",
          online: "පද්ධති සජීවීයි"
        }
      },
      partner_agreements: {
        header: {
          badge: "ආයතනික ලේඛනාධිකාරය",
          title_1: "උපායමාර්ගික",
          title_2: "ගිවිසුම්",
          subtitle: "ඔබේ මෙහෙයුම්-වැදගත් හවුල්කාරිත්වයන් සහ මූල්‍ය කැපවීම් නිරීක්ෂණය කරන්න සහ කළමනාකරණය කරන්න."
        },
        search_placeholder: "ආයතනික ලේඛන සොයන්න...",
        table: {
          mission: "ව්‍යාපාර මෙහෙයුම් මධ්‍යස්ථානය",
          vector: "සහාය දෛශිකය",
          asset: "වත්කම් වටිනාකම",
          institutional: "ආයතනික"
        },
        roadmap: "මාර්ග සිතියම",
        subtitle: "ඔබේ සත්‍යාපිත ගිවිසුම් සඳහා වන ක්‍රියාත්මක කිරීමේ මාර්ග සිතියම් කළමනාකරණය කර නිරීක්ෂණය කරන්න. අපගේ මෙහෙවර-විවේචනාත්මක ලුහුබැඳීමේ පද්ධතිය පූර්ණ වගවීම සහතික කරයි.",
        global_hub_desc: "සියලුම සක්‍රීය මෙහෙයුම් හරහා වන සියලුම ආයතනික සන්ධිස්ථාන සඳහා ඒකාබද්ධ බුද්ධි ඒකකය.",
        progress: "මෙහෙයුම් ක්‍රියාත්මක කිරීමේ ප්‍රගතිය",
        total_volume: "මුළු ප්‍රාග්ධන පරිමාව",
        partner_node: "හවුල්කාර ඒකකය",
        mission_node: "මෙහෙයුම් ඒකකය",
        filter_all: "සියලු ව්‍යුහයන්",
        filter_pending: "ප්‍රමාදිත",
        filter_executing: "ක්‍රියාත්මක වෙමින් පවතින",
        filter_completed: "සම්පූර්ණයි",
        create_milestone: "නව සන්ධිස්ථානයක් ස්ථාපනය කරන්න",
        empty_title: "මෙම මෙහෙයුම් ඒකකය සඳහා කිසිදු සන්ධිස්ථානයක් හමු නොවීය.",
        empty_desc: "මෙහෙයුම් නිරීක්ෂණය ආරම්භ කිරීම සඳහා මාර්ග සිතියම සක්‍රීය කරන්න.",
        table_milestones: {
          title: "සන්ධිස්ථාන ප්‍රොටෝකෝලය",
          date: "ක්‍රියාත්මක කිරීමේ දිනය",
          status: "වත්මන් තත්ත්වය",
          evidence: "සත්‍යාපිත සාක්ෂි",
          actions: "ලේඛන ඒකකය"
        },
        not_uploaded: "උඩුගත කර නැත",
        view_evidence: "තොරතුරු බලන්න",
        edit: "ප්‍රොටෝකෝලය සංස්කරණය කරන්න",
        delete: "ඒකකය ඉවත් කරන්න",
        modal: {
          title: "සන්ධිස්ථාන මෙහෙයුම",
          label_title: "සන්ධිස්ථානයේ මාතෘකාව",
          label_desc: "සවිස්තරාත්මක විස්තරය",
          label_date: "ක්‍රියාත්මක කිරීමේ දිනය",
          label_status: "ඒකක තත්ත්වය",
          label_evidence: "සාක්ෂි ගොනුව (අත්‍යවශ්‍ය නොවේ)",
          submit: "මෙහෙයුම බලය පවරන්න"
        },
        agreement_header: "ගිවිසුම් සන්දර්භය",
        agreement_meta: "ප්‍රධාන මෙහෙයුම් ඒකකය සඳහා වන පාරදත්ත.",
        status: {
          public: "ප්‍රසිද්ධියේ පෙනේ",
          needs_formalization: "නිල වශයෙන් පිළිගන්න",
          needs_verification: "සත්‍යාපනය කර සක්‍රීය කරන්න",
          details: "සවිස්තරාත්මක බුද්ධි මධ්‍යස්ථානය",
          execution: "ක්‍රියාත්මක කිරීමේ පදනම"
        },
        no_data: "ආයතනික ගිවිසුම් කිසිවක් ලියාපදිංචි කර නැත.",
        modal_intel: {
          audit_header: "ආයතනික විගණන මධ්‍යස්ථානය",
          intelligence_header: "මෙහෙයුම් බුද්ධි මධ්‍යස්ථානය",
          no_data: "ආයතනික මෙහෙයුම් දත්ත තවමත් ඇතුළත් කර නැත.",
          capital_value: "ප්‍රාග්ධන වටිනාකම",
          registry_type: "ලේඛන වර්ගය",
          system: "පද්ධතිය",
          close: "බුද්ධි තොරතුරු පත්‍රිකාව වසන්න"
        },
        milestones: {
          header_badge: "මෙහෙයුම් ක්‍රියාත්මක කිරීමේ මධ්‍යස්ථානය",
          title: "ක්‍රියාත්මක කිරීමේ සැලැස්ම",
          subtitle: "වත්මන් මානුෂීය සබඳතා සඳහා වන උපායමාර්ගික ප්‍රගතිය නිරීක්ෂණය කර සත්‍යාපනය කරන්න.",
          progress_label: "ක්‍රියාත්මක කිරීමේ වේගය",
          add_step: "ක්‍රියාත්මක කිරීමේ පියවරක් ලියාපදිංචි කරන්න",
          filters: {
            all: "සියලුම පියවර",
            pending: "ඉදිරියට එන",
            executing: "ක්‍රියාත්මක වෙමින් පවතින",
            success: "සාර්ථකව නිම කළ"
          },
          table: {
             step: "ක්‍රියාත්මක කිරීමේ පියවර",
             due: "ඉලක්කගත දිනය",
             status: "සමමුහුර්ත තත්ත්වය",
             actions: "ක්‍රියාකාරකම් මධ්‍යස්ථානය"
          },
          no_steps: "ක්‍රියාත්මක කිරීමේ පියවර කිසිවක් ලියාපදිංචි කර නැත.",
          modal: {
            add_title: "නව ක්‍රියාත්මක කිරීමේ පියවරක් ආරම්භ කරන්න",
            edit_title: "ක්‍රියාත්මක කිරීමේ පියවර වෙනස් කරන්න",
            title_label: "පියවරේ නම",
            desc_label: "මෙහෙයුම් සන්දර්භය",
            due_label: "ඉලක්කගත දිනය",
            status_label: "යෙදවීමේ තත්ත්වය",
            evidence_label: "ක්‍රියාත්මක කළ බවට සාක්ෂි",
            save: "දත්ත සමමුහුර්ත කරන්න",
            delete: "පියවර ඉවත් කරන්න"
          }
        },
        pledges: {
          header_badge: "ප්‍රාග්ධන කැපවීම් මධ්‍යස්ථානය",
          title: "උපායමාර්ගික ප්‍රතිඥා",
          subtitle: "අනාගත මෙහෙයුම් සඳහා වන ආයතනික කැපවීම්.",
          stats: {
            total: "කැප කළ මුළු වත්කම්",
            active: "සක්‍රීය උපායමාර්ගික නූල්"
          },
          table: {
            campaign: "ඉලක්කගත මෙහෙයුම",
            amount: "කැප කළ මුදල",
            status: "විගණන මට්ටම",
            date: "කාල මුද්‍රාව"
          },
          no_pledges: "උපායමාර්ගික ප්‍රතිඥා කිසිවක් දර්ශකගත කර නැත."
        }
      },
      institutional_agreements: {
        title: "උපායමාර්ගික හවුල්කාරිත්වයන්",
        subtitle: "ඔබේ සත්‍යාපිත ආයතනික සහයෝගීතා සහ වත්කම් වෙන්කිරීමේ ඒකකවල ලේඛකාධිකාරය.",
        search: "තොරතුරු ඒකකය සොයන්න...",
        create: "හවුල්කාරිත්වය ආරම්භ කරන්න",
        view_details: "තොරතුරු බලන්න",
        formalize: "ගිවිසුම විධිමත් කරන්න",
        activate: "ගිවිසුම සක්‍රීය කරන්න",
        roadmap: "සන්ධිස්ථාන මාර්ග සිතියම",
        empty: "දැනට ක්‍රියාකාරී උපායමාර්ගික හවුල්කාරිත්වයන් කිසිවක් නැත.",
        table: {
          id: "ප්‍රොටෝකෝල හැඳුනුම්පත",
          mission: "මෙහෙයුමේ මාතෘකාව",
          partner: "හවුල්කාර ඒකකය",
          allocation: "වත්කම් වෙන්කිරීම",
          state: "වත්මන් තත්ත්වය",
          action: "ක්‍රියාකාරී මධ්‍යස්ථානය"
        },
        success: {
          formalized: "ගිවිසුම විධිමත් කර අත්සන් කරන ලදී.",
          activated: "ගිවිසුම සත්‍යාපනය කර සක්‍රීය කරන ලදී."
        },
        error: {
          onboarding: "හවුල්කාර පැතිකඩ හමු නොවීය. කරුණාකර ඇතුළත් වීමේ ක්‍රියාවලිය සම්පූර්ණ කරන්න.",
          load: "හවුල්කාර පැතිකඩ පූරණය කිරීමට අපොහොසත් විය.",
          sign: "අනුමත කිරීමේ අත්සන අසාර්ථක විය.",
          activate: "සක්‍රීය කිරීම අසාර්ථක විය."
        }
      },
      campaign_registry: {
        operational_hub: "මෙහෙයුම් මධ්‍යස්ථානය",
        title_1: "මෙහෙයුම්",
        title_2: "ලේඛකාධිකාරය",
        subtitle: "ගෝලීය ජාලය පුරා බලපෑම් ඇති කරන මුලපිරීම් සම්බන්ධීකරණය, ප්‍රකාශනය සහ අධීක්ෂණය කරන්න.",
        create_button: "නව මෙහෙයුමක් අරඹන්න",
        stats: {
          network: "ජාල මෙහෙයුම්",
          active: "ක්‍රියාකාරී තත්ත්වය",
          pending: "සංශෝධනය වෙමින් පවතින",
          impact: "මුළු බලපෑම"
        },
        filter: {
          placeholder: "ව්‍යාපාර සොයන්න...",
          all: "සියලුම තත්වයන්",
          proposals: "යෝජනා පමණි",
          live: "සජීවී මෙහෙයුම්",
          success: "සාර්ථකව නිම කළ",
          closed: "වසන ලද"
        },
        table: {
          identity: "මෙහෙයුම් අනන්‍යතාවය",
          progress: "ඉලක්කගත ප්‍රගතිය",
          level: "මෙහෙයුම් මට්ටම",
          actions: "ක්‍රියාකාරකම් මධ්‍යස්ථානය",
          submit: "ලේඛනය ඉදිරිපත් කරන්න",
          approve: "අනුමත කරන්න",
          details: "සවිස්තරාත්මක දර්ශකය"
        },
        no_results: "අදාළ මෙහෙයුම් කිසිවක් හමු නොවීය."
      },
      pledge_modal: {
        mission_support: "ව්‍යාපාර සහය මධ්‍යස්ථානය",
        title_new: "නව සහය සැලැස්මක් අරඹන්න",
        title_edit: "සහය සැලැස්ම යාවත්කාලීන කරන්න",
        amount_label: "පරිත්‍යාග මුදල (LKR)",
        frequency_label: "පරිත්‍යාග වාර ගණන",
        freq: {
          "one-time": "එක් වරක්",
          monthly: "මාසිකව",
          quarterly: "කාර්තුවකට වරක්",
          annually: "වාර්ෂිකව"
        },
        gift_suffix: "පරිත්‍යාග මධ්‍යස්ථානය",
        notes_label: "මෙහෙයුම් සටහන්",
        notes_placeholder: "මෙම ප්‍රාග්ධන යෙදවීම සඳහා වන පණිවිඩය...",
        start_date: "ආරම්භක දිනය",
        cancel: "අවලංගු කරන්න",
        save_plan: "සැලැස්ම සමමුහුර්ත කරන්න",
        create_plan: "සැලැස්ම ආරම්භ කරන්න",
        loading_missions: "ගෝලීය මෙහෙයුම් දර්ශකය පරීක්ෂා කරමින්..."
      },
      pledges_page: {
        header_badge: "බලපෑම සහය මධ්‍යස්ථානය",
        title_1: "පරිත්‍යාග",
        title_2: "පුවරුව",
        subtitle: "ඔබේ අඛණ්ඩ මානුෂීය සහය කළමනාකරණය කරන්න. සෑම දායකත්වයක්ම අපගේ සත්‍යාපිත විනිවිදභාවයේ ප්‍රමිතීන් මගින් නිරීක්ෂණය කරනු ලැබේ.",
        profile_verification: {
          title: "පැතිකඩ සත්‍යාපනය අවශ්‍යයි",
          desc: "ව්‍යාපෘති වලට සහය වීමට සහ ඔබේ බලපෑම කළමනාකරණය කිරීමට, ඔබේ පැතිකඩ සම්පූර්ණයෙන්ම සකස් කළ යුතුය.",
          button: "මගේ පැතිකඩ සම්පූර්ණ කරන්න"
        },
        no_pledges: {
          title: "සක්‍රීය ප්‍රතිඥා නැත",
          desc: "ඔබේ පළමු සත්‍යාපිත මානුෂීය ව්‍යාපෘතියට සහය වීමට ව්‍යාපාර ගවේෂණය කරන්න."
        },
        card: {
          support_label: "සහය ප්‍රතිඥාව",
          cycle_suffix: "මෙහෙයුම් චක්‍රය",
          gifts_verified: "සත්‍යාපිත ත්‍යාග",
          total_given: "පරිත්‍යාග කළ මුළු මුදල",
          next_support: "මීළඟ සහය දිනය",
          stop_button: "ප්‍රතිඥාව නවත්වන්න",
          payments_unit: "ගෙවීම්"
        },
        status: {
          active: "සක්‍රීයයි",
          fulfilled: "සම්පූර්ණයි",
          cancelled: "අවලංගුයි",
          pending: "අනුමැතිය අපේක්ෂිතයි"
        }
      },
      donation_history: {
        header_badge: "සත්‍යාපිත වාර්තා",
        title_1: "මගේ",
        title_2: "පරිත්‍යාග",
        subtitle: "කරන ලද සෑම දායකත්වයක්ම කළමනාකරණය කරන්න. සෑම ගනුදෙනුවක්ම TransFund සත්‍යාපන පද්ධතිය හරහා සහතික කරනු ලැබේ.",
        total_impact_label: "මුළු බලපෑම",
        profile_verification: {
          title: "පැතිකඩ සත්‍යාපනය අවශ්‍යයි",
          desc: "ඔබේ සම්පූර්ණ පරිත්‍යාග ඉතිහාසය සහ රිසිට්පත් ලබා ගැනීමට කරුණාකර ඔබේ පැතිකඩ සම්පූර්ණ කරන්න."
        },
        no_history: {
          title: "ඉතිහාසයක් හමු නොවීය",
          desc: "ඔබ තවමත් කිසිදු ගනුදෙනුවක් කර නැති බව පෙනේ. ඔබේ බලපෑම මෙහි වාර්තා වනු ඇත."
        },
        active_commitments: "සක්‍රීය උපායමාර්ගික කැපවීම්",
        impact_registry: "ඓතිහාසික බලපෑම් ලේඛකාධිකාරය",
        card: {
          strategy_suffix: "උපායමාර්ගය",
          ref_id: "යොමු අංකය",
          status_label: "තත්ත්වය",
          active_status: "සක්‍රීයයි",
          method_label: "ගෙවීම් ක්‍රමය",
          project_label: "සහය දුන් ව්‍යාපෘතිය",
          general_fund: "පොදු අරමුදල් මධ්‍යස්ථානය",
          receipt: "සත්‍යාපිත රිසිට්පත් දර්ශකය",
          status_verified: "සත්‍යාපිත මධ්‍යස්ථානය"
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
        verification_center: "சரிபார்ப்பு மையம்",
        milestone_registry: "மைல்கல் பதிவேடு",
        corporate_profile: "கார்ப்பரேட் சுயவிவரம்",
        ai_matchmaker: "AI மேட்ச்மேக்கர்",
        csr_hub: "CSR மையம்",
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
        donor_dashboard: "நன்கொடையாளர் டாஷ்போர்டு",
        partner_dashboard: "பங்குதாரர் டாஷ்போர்டு"
      },
      sidebar: {
        sections: {
          management: "நிர்வாக மையம்",
          partnership_core: "கூட்டுறவு மையம்",
          intel_ai: "நுண்ணறிவு & AI",
          institutional: "நிறுவன மையம்",
          overview: "மேலோட்டம்",
          donors: "நன்கொடையாளர்கள்",
          missions: "பணிகள்",
          partners: "பங்குதாரர்கள்",
          campaigns: "பிரச்சாரங்கள்",
          giving: "நன்கொடை",
          account: "கணக்கு"
        },
        items: {
          operations_log: "செயல்பாட்டு பதிவு",
          collab_missions: "கூட்டுப் பணிகள்",
          partner_network: "பங்குதாரர் நெட்வொர்க்"
        }
      },
      marketplace: {
        header: {
          badge: "வாய்ப்புகளை ஆராயுங்கள்",
          title_1: "பிரச்சார",
          title_2: "சந்தை",
          subtitle: "சரிபார்க்கப்பட்ட செயல்பாட்டு பிரச்சாரங்களைக் கண்டறிந்து ஆதரவளிக்கவும். நீங்கள் ஒரு நன்கொடை அளிக்கும் தனிநபராக இருந்தாலும் அல்லது மூலோபாயக் கூட்டாண்மையை உருவாக்கும் நிறுவனமாக இருந்தாலும், உங்கள் தாக்கம் இங்கிருந்து தொடங்குகிறது."
        },
        search: "பிரச்சாரங்களைத் தேடுங்கள்...",
        filter_goal: "இலக்கின்படி வடிகட்டவும்",
        all_goals: "அனைத்து இலக்குகள்",
        no_results: "பிரச்சாரங்கள் எதுவும் இல்லை",
        adjust_filters: "உங்கள் வடிப்பான்கள் அல்லது தேடல் சொற்களை மாற்ற முயற்சிக்கவும்.",
        raised: "திறட்டப்பட்டது",
        goal: "இலக்கு",
        target: "இலக்கு",
        propose_partnership: "கூட்டுறவைப் பரிந்துரைக்க",
        support_campaign: "பிரச்சாரத்தை ஆதரிக்கவும்",
        view_details: "முழு விவரங்களையும் காண்க",
        loading: "செயலில் உள்ள பிரச்சாரங்கள் ஏற்றப்படுகின்றன..."
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
        },
        allocation: {
          title: "மூலோபாய ஒதுக்கீடு குறியீடு",
          subtitle: "உங்கள் ஆதரவு போர்ட்ஃபோலியோவில் உள்ள பணி பன்முகத்தன்மை."
        },
        activity: {
          title: "சமீபத்திய செயல்பாடுகள்",
          subtitle: "உங்கள் பங்களிப்பு வரலாற்றின் கடைசி தரவு முனைகள்.",
          view_all: "முழு வரலாற்றையும் காண்க",
          empty: "முதல் பணி தரவு முனை நிறுவப்படும் வரை காத்திருக்கிறது."
        },
        registry: {
          title: "சமீபத்திய தாக்கப் பதிவு",
          subtitle: "உங்கள் கடைசியாக அங்கீகரிக்கப்பட்ட மூலதன ஓட்டங்களின் விரிவான ஒத்திசைவு.",
          view_full: "முழு பதிவேட்டையும் காண்க",
          table: {
            protocol_id: "நெறிமுறை ஐடி",
            mission_title: "பணி தலைப்பு",
            asset_volume: "மூலதன அளவு",
            current_state: "தற்போதைய நிலை",
            system_node: "கணினி முனை"
          },
          gen_support: "பொது ஆதரவு ஒதுக்கீடு",
          awaiting: "புதிய மூலதன திரட்டல் முனைகளுக்காக காத்திருக்கிறது..."
        },
        pledges_overview: {
          title: "மூலோபாய சபதங்கள்",
          subtitle: "நிலையான மனிதாபிமான தாக்கத்தை ஏற்படுத்தும் தொடர்ச்சியான அர்ப்பணிப்புகள்.",
          manage: "சபதங்களை நிர்வகிக்கவும்",
          plan_suffix: "திட்டம்",
          gen_sustainable: "பொது நிலையான ஆதரவு",
          impact_level: "தாக்க நிலை",
          active_commitment: "செயலில் உள்ள அர்ப்பணிப்பு",
          start_pledge: "உங்கள் முதல் நிலையான மூலோபாய சபதத்தைத் தொடங்குங்கள்."
        }
      },
      ngo_dashboard: {
        welcome: "வரவேற்பு",
        verification_badge: "சரிபார்ப்பு நிலுவையில் உள்ளது",
        control_center: "நிறுவன கட்டுப்பாட்டு மையம்",
        tagline: "உங்கள் நிறுவனம் தற்போது உயர்தர தணிக்கைக்கு உட்பட்டுள்ளது.",
        locked_: "பூட்டப்பட்ட ஒத்திசைவைத் தொடங்கு",
        treasury_analytics: "கருவூல பகுப்பாய்வு",
        active_projects: "செயலில் உள்ள திட்டங்கள்",
        trust_rating: "நம்பிக்கை மதிப்பீடு",
        total_raised: "மொத்தம் திரட்டப்பட்டது",
        treasury_balance: "கருவூல இருப்பு",
        verified_missions: "சரிபார்க்கப்பட்ட பணிகள்",
        transparency_score: "சரிபார்க்கப்பட்ட வெளிப்படைத்தன்மை",
        cumulative_intake: "மொத்த வருவாய்",
        allocated_projects: "திட்டங்களுக்கு ஒதுக்கப்பட்டது"
      },
      finance: {
        registry_title: "NGO நிதி பதிவேடு",
        transparency_hub: "நிதி வெளிப்படைத்தன்மை மையம்",
        managing_funds: "நிதி மேலாண்மை",
        gross_income: "மொத்த வருமானம்",
        total_allocated: "மொத்த ஒதுக்கீடு",
        unallocated_reserves: "ஒதுக்கப்படாத இருப்பு",
        allocation_breakdown: "ஒதுக்கீடு பகுப்பாய்வு",
        by_category: "வகை வாரியாக",
        deployment_log: "மூலதன வரிசைப்படுத்தல் பதிவு",
        audit_: "கள செயல்பாடுகளுடன் தணிக்கை ஒத்திசைவு",
        allocate_capital: "மூலதனத்தை ஒதுக்கு",
        date: "தேதி",
        mission_category: "பணி வகை",
        amount_sent: "அனுப்பப்பட்ட தொகை",
        registry_id: "பதிவு ஐடி"
      },
      home: {
        hero: {
          badge_verified: "சரிபார்க்கப்பட்ட தொண்டு தளம்",
          badge_active: "{{role}} போர்டல் செயலில் உள்ளது",
          title_welcome: "மீண்டும் வருக,",
          title_main_1: "நவீன வழங்கல்.",
          title_main_2: "முழுமையான நம்பிக்கை.",
          subtitle: "உலகளாவிய மூலதனத்திற்கும் நேரடி உள்ளூர் மனிதாபிமான தாக்கத்திற்கும் இடையிலான இடைவெளியைக் குறைக்க பரவலாக்கப்பட்ட வெளிப்படைத்தன்மை நெறிமுறைகளைப் பயன்படுத்துதல். சரிபார்க்கப்பட்ட நிறுவன நேர்மை.",
          explore_button: "காரணங்களை ஆராயுங்கள்",
          join_button: "பணியில் சேருங்கள்",
          initialize_profile: "சுயவிவரத்தைத் தொடங்கவும் →",
          methodology: "எங்கள் வழிமுறை"
        },
        stats: {
          assets: "ஒத்திசைக்கப்பட்ட சொத்துக்கள்",
          milestones: "தாக்க மைல்கற்கள்",
          agents: "மூலோபாய உலகளாவிய முகவர்கள்",
          audit: "வெளிப்படைத்தன்மை தணிக்கை தரம்"
        },
        features: {
          badge: "செயல்பாட்டு நெறிமுறை v4.0",
          title_1: "நேரடி சக்தி.",
          title_2: "உலகளாவிய மையம்.",
          feature_1_t: "சரிபார்க்கப்பட்ட NGO-க்கள்",
          feature_1_d: "செயல்பாட்டு சிறப்பு மற்றும் உயர் நம்பிக்கை மதிப்பெண்களை உறுதி செய்வதற்காக ஒவ்வொரு பங்குதாரரும் பல கட்ட சரிபார்ப்புக்கு உட்படுகிறார்கள்.",
          feature_2_t: "நேரடி கண்காணிப்பு",
          feature_2_d: "நிகழ்நேர மைல்கல் புதுப்பிப்புகள் மற்றும் புகைப்பட ஆதாரங்கள் மூலம் உங்கள் பங்களிப்பு களத்தை வந்தடைவதைக் காணுங்கள்.",
          feature_3_t: "மூலோபாய AI",
          feature_3_d: "உங்கள் மதிப்புகளுக்கு ஏற்ப தனிப்பயனாக்கப்பட்ட மனிதாபிமான நுண்ணறிவு மற்றும் நன்கொடை பரிந்துரைகளைப் பெறுங்கள்.",
          feature_4_t: "பாதுகாப்பான நுழைவாயில்",
          feature_4_d: "உலகளாவிய பாதுகாப்பு மற்றும் உள்ளூர் வேகத்தை உறுதி செய்யும் அனைத்து மூலதன இடமாற்றங்களுக்கும் தொழில் தரநிலை குறியாக்கம்.",
        },
        causes: {
          badge: "செயலில் உள்ள பணி பதிவேடு",
          title: "தற்போதைய முயற்சிகள்.",
          view_all: "அனைத்து பதிவேடுகளையும் காண்க"
        },
        cta: {
          title: "மாற்றத்திற்கு தயாரா?",
          subtitle: "முழுமையான வெளிப்படைத்தன்மை மற்றும் நேரடிச் செயலுக்கு அர்ப்பணிக்கப்பட்ட சரிபார்க்கப்பட்ட உலகளாவிய நன்கொடையாளர்களின் நெட்வொர்க்கில் இணையுங்கள்."
        }
      },
      ai_match: {
        loading: {
          title: "பணி நுண்ணறிவு மையம் ஒத்திசைக்கப்படுகிறது...",
          subtitle: "தனியுரிம சினெர்ஜி அல்காரிதம் v2.4 இயங்குகிறது"
        },
        hero: {
          badge: "சந்தைக்குத் தயாரான பணி பொருத்த மையம்",
          title: "AI சினெர்ஜி மேட்ச்மேக்கர்",
          subtitle: "உங்கள் CSR கவனப்பகுதிகள் மற்றும் மூலதன வரிசைப்படுத்தல் இலக்குகளின் அடிப்படையில் உலகளாவிய நெட்வொர்க் முழுவதும் அதிக சினெர்ஜி NGO ஒத்துழைப்புகளை அடையாளம் காணவும்."
        },
        grid: {
          synergy: "சினெர்ஜி",
          initialize_: "ஒத்திசைவைத் தொடங்கு",
          ngo: "NGO"
        },
        map: {
          title: "புவி-வெளிப்படைத்தன்மை மையம்",
          subtitle: "தளவாட வெற்றிடங்கள் மற்றும் பணி வாய்ப்புகளை அடையாளம் காண உலகளாவிய மனிதாபிமான நிலப்பரப்பை ஸ்கேன் செய்யுங்கள்.",
          density: "நெட்வொர்க் அடர்த்தி",
          coverage: "செயலில் உள்ள வரைபடம்: {{percent}}% கவரேஜ்",
          expand: "இயந்திரத்தை விரிவுபடுத்து"
        },
        reasons: {
          csr: "உங்கள் {{count}} சிஎஸ்ஆர் தூண்களுடன் சீரமைக்கப்பட்டுள்ளது.",
          scale: "உங்கள் முதலீட்டு அளவோடு செயல்பாட்டு சீரமைப்பு."
        },
        errors: {
         _failed: "பணி நுண்ணறிவை ஒத்திசைக்கத் தவறிவிட்டது."
        }
      },
      partner_dashboard: {
        welcome: "நிறுவன மேலோட்டம்",
        tagline: "உங்கள் மூலோபாய கூட்டாண்மைகள் மற்றும் மனிதாபிமான மூலதன வரிசைப்படுத்தல்.",
        overview_badge: "பங்குதாரர் மேலோட்டம்",
        verified_badge: "சரிபார்க்கப்பட்ட கணக்கு",
        pending_badge: "கணக்கு நிலுவையில் உள்ளது",
        manage_settings: "அமைப்புகளை நிர்வகி",
        active_agreements: "செயலில் உள்ள ஒப்பந்தங்கள்",
        pending_requests: "நிலுவையில் உள்ள கோரிக்கைகள்",
        total_contributions: "மொத்த பங்களிப்புகள்",
        org_health: "நிறுவன ஆரோக்கியம்",
        partnerships_in_progress: "கூட்டுறவுகள் செயல்பாட்டில் உள்ளன",
        awaiting_review: "மதிப்பாய்விற்காக காத்திருக்கிறது",
        lifetime_total: "மொத்த நன்கொடைத் தொகை",
        verification_level: "சரிபார்ப்பு நிலை",
        recent_activity: "சமீபத்திய செயல்பாட்டு மையம்",
        view_all: "அனைத்து ஒப்பந்தங்களையும் காண்க",
        table: {
          campaign: "பிரச்சார பணி",
          amount: "ஒப்புக்கொள்ளப்பட்ட தொகை",
          status: "நிலை",
          actions: "செயல்பாட்டு மையம்"
        },
        no_agreements: "ஒப்பந்தங்கள் எதுவும் கிடைக்கவில்லை.",
        discovery: {
          title: "பிரச்சாரங்களை ஆராயுங்கள்",
          subtitle: "நிதி தேவைப்படும் செயலில் உள்ள திட்டங்களைக் கண்டறிந்து இன்று புதிய கூட்டாண்மைகளை முன்மொழியுங்கள்.",
          cta: "அனைத்து பிரச்சாரங்களையும் காண்க",
          online: "கணினி செயல்பாட்டில் உள்ளது"
        }
      },
      partner_agreements: {
        header: {
          badge: "நிறுவனப் பதிவேடு",
          title_1: "மூலோபாய",
          title_2: "ஒப்பந்தங்கள்",
          subtitle: "உங்கள் பணி-முக்கியமான கூட்டாண்மைகள் மற்றும் நிதி அர்ப்பணிப்புகளைக் கண்காணிக்கவும், நிர்வகிக்கவும் மற்றும் முறைப்படுத்தவும்."
        },
        search_placeholder: "நிறுவனப் பதிவேட்டில் தேடுங்கள்...",
        table: {
          mission: "பிரச்சார பணி மையம்",
          vector: "ஆதரவு திசைவி",
          asset: "சொத்து மதிப்பு",
          status: "நிறுவன நிலை",
          actions: "செயல்பாட்டு மையம்"
        },
        status: {
          public: "வெளிப்படையாகத் தெரியும்",
          needs_formalization: "முறைப்படுத்துதல் மையம்",
          needs_verification: "சரிபார்த்து செயல்படுத்து",
          details: "விரிவான நுண்ணறிவு மையம்",
          execution: "செயல்படுத்தல் மையம்"
        },
        no_data: "நிறுவன ஒப்பந்தங்கள் எதுவும் பதிவு செய்யப்படவில்லை.",
        modal: {
          audit_header: "நிறுவன தணிக்கை மையம்",
          intelligence_header: "பணி நுண்ணறிவு மையம்",
          no_data: "நிறுவன பணி தரவு ஒத்திசைக்கப்படவில்லை.",
          capital_value: "மூலதன மதிப்பு",
          registry_type: "பதிவு வகை",
          system: "அமைப்பு",
          close: "நுண்ணறிவு சுருக்கத்தை மூடு"
        },
        milestones: {
          header_badge: "பணி அமலாக்க மையம்",
          title: "அமலாக்க வரைபடம்",
          subtitle: "தற்போதைய மனிதாபிமானக் கூட்டணிகளுக்கான மூலோபாய முன்னேற்றத்தைக் கண்காணிக்கவும், நிர்வகிக்கவும் மற்றும் சரிபார்க்கவும்.",
          progress_label: "அமலாக்க வேகம்",
          add_step: "அமலாக்கப் படியைப் பதிவு செய்க",
          filters: {
            all: "அனைத்து நிலைகளும்",
            pending: "வரவிருக்கும்",
            executing: "செயல்பாட்டில் உள்ளது",
            success: "நிறைவடைந்தது"
          },
          table: {
             step: "அமலாக்கப்படி மையம்",
             due: "இலக்கு திசையன்",
             status: "ஒத்திசைவு நிலை",
             actions: "செயல்பாட்டு மேட்ரிக்ஸ்"
          },
          no_steps: "அமலாக்கப் படிகள் எதுவும் பதிவு செய்யப்படவில்லை.",
          modal: {
            add_title: "அமலாக்கப் படியைத் தொடங்கவும்",
            edit_title: "அமலாக்கப் படியைச் சீரமைக்கவும்",
            title_label: "படி அடையாளம்",
            desc_label: "செயல்பாட்டு சூழல்",
            due_label: "இலக்கு தேதி",
            status_label: "வரிசைப்படுத்தல் நிலை",
            evidence_label: "அமலாக்கத்திற்கான சான்று",
            save: "ஒத்திசைவு மையம்",
            delete: "நீக்கவும்"
          }
        },
        pledges: {
          header_badge: "மூலதன அர்ப்பணிப்பு மையம்",
          title: "மூலோபாய சபதங்கள்",
          subtitle: "எதிர்கால பணி ஆதரவு மையங்களுக்கான நிறுவன அர்ப்பணிப்புகள்.",
          stats: {
            total: "மொத்தம் வழங்கப்பட்ட சொத்துக்கள்",
            active: "நேரடி மூலோபாய இழைகள்"
          },
          table: {
            campaign: "இலக்கு பணி மையம்",
            amount: "வழங்கப்பட்ட தொகை",
            status: "தணிக்கை நிலை",
            date: "நேரமுத்திரை"
          },
          no_pledges: "மூலோபாய சபதங்கள் எதுவும் அட்டவணைப்படுத்தப்படவில்லை."
        }
      },
      institutional_agreements: {
        title: "மூலோபாய கூட்டாண்மைகள்",
        subtitle: "உங்கள் சரிபார்க்கப்பட்ட நிறுவன ஒத்துழைப்புகள் மற்றும் சொத்து ஒதுக்கீடு முனைகளின் பதிவேடு.",
        search: "தேடல் மையம்...",
        create: "கூட்டுறவை இயக்கவும்",
        view_details: "பதிவுகளைக் காண்க",
        formalize: "ஒப்பந்தத்தை முறைப்படுத்தவும்",
        activate: "ஒப்பந்தத்தை அங்கீகரிக்கவும்",
        roadmap: "மைல்கல் வரைபடம்",
        empty: "தற்போது எந்த மூலோபாய கூட்டாண்மைகளும் இல்லை.",
        table: {
          id: "நெறிமுறை ஐடி",
          mission: "பணித் தலைப்பு",
          partner: "கூட்டாளர் முனை",
          allocation: "சொத்து ஒதுக்கீடு",
          state: "தற்போதைய நிலை",
          action: "செயல்பாட்டு மையம்"
        },
        success: {
          formalized: "ஒப்பந்தம் முறைப்படுத்தப்பட்டு கையெழுத்திடப்பட்டது.",
          activated: "ஒப்பந்தம் சரிபார்க்கப்பட்டு செயல்படுத்தப்பட்டது."
        },
        error: {
          onboarding: "கூட்டாளர் சுயவிவரம் கண்டறியப்படவில்லை.",
          load: "சுயவிவரத்தை ஏற்றுவதில் தோல்வி.",
          sign: "கையெழுத்திடுதல் தோல்வியடைந்தது.",
          activate: "செயல்படுத்துதல் தோல்வியடைந்தது."
        }
      },
      campaign_registry: {
        operational_hub: "செயல்பாட்டு மையம்",
        title_1: "பணி",
        title_2: "பதிவேடு",
        subtitle: "உலகளாவிய நெட்வொர்க் முழுவதும் தாக்க முயற்சிகளை ஒருங்கிணைக்கவும், வெளியிடவும் மற்றும் கண்காணிக்கவும்.",
        create_button: "பணியைத் தொடங்கவும்",
        stats: {
          network: "நெட்வொர்க் பணிகள்",
          active: "செயல்பாட்டு நிலை",
          pending: "நிலுவையில் உள்ள வரைவுகள்",
          impact: "மொத்த தாக்கம்"
        },
        filter: {
          placeholder: "பணிகளைத் தேடுங்கள்...",
          all: "அனைத்து நிலைகளும்",
          proposals: "முன்மொழிவுகள் மட்டும்",
          live: "நேரடி பணிகள்",
          success: "நிறைவடைந்தது",
          closed: "மூடப்பட்டது"
        },
        table: {
          identity: "பணி அடையாளம்",
          progress: "இலக்கு முன்னேற்றம்",
          level: "செயல்பாட்டு நிலை",
          actions: "செயல்பாட்டு மையம்",
          submit: "பதிவேட்டைச் சமர்ப்பிக்க",
          approve: "அங்கீகரிக்க",
          details: "விவரக் குறியீடு"
        },
        no_results: "பொருத்தமான பணிகள் எதுவும் இல்லை."
      },
      pledge_modal: {
        mission_support: "பிரச்சார ஆதரவு மையம்",
        title_new: "புதிய ஆதரவுத் திட்டத்தைத் தொடங்குங்கள்",
        title_edit: "ஆதரவுத் திட்டத்தைப் புதுப்பிக்கவும்",
        amount_label: "நன்கொடைத் தொகை (LKR)",
        frequency_label: "நன்கொடை அதிவெண்",
        freq: {
          "one-time": "ஒரு முறை",
          monthly: "மாதாந்திரம்",
          quarterly: "காலாண்டு",
          annually: "ஆண்டுதோறும்"
        },
        gift_suffix: "நன்கொடை மையம்",
        notes_label: "செயல்பாட்டுக் குறிப்புகள்",
        notes_placeholder: "மூலோபாய நோக்கம்...",
        start_date: "தொடங்கும் தேதி",
        cancel: "ரத்து செய்",
        save_plan: "ஆதரவு மையத்தை ஒத்திசைக்கவும்",
        create_plan: "ஆதரவு மையத்தைத் தொடங்கவும்",
        loading_missions: "பணிகளைத் தேடுகிறது..."
      },
      pledges_page: {
        header_badge: "தாக்க ஆதரவு மையம்",
        title_1: "என் நன்கொடை",
        title_2: "டாஷ்போர்டு",
        subtitle: "மனிதாபிமான பணிகளுக்கான உங்கள் தொடர்ச்சியான ஆதரவை நிர்வகிக்கவும். ஒவ்வொரு பங்களிப்பும் எங்கள் சரிபார்க்கப்பட்ட வெளிப்படைத்தன்மை தரங்களால் கண்காணிக்கப்படுகிறது.",
        profile_verification: {
          title: "சுயவிவர சரிபார்ப்பு தேவை",
          desc: "திட்டங்களை ஆதரிக்கத் தொடங்க உங்கள் சுயவிவரம் முழுமையாக அமைக்கப்பட வேண்டும்.",
          button: "என் சுயவிவரத்தை முடிக்கவும்"
        },
        no_pledges: {
          title: "சক্রিয় சபதங்கள் இல்லை",
          desc: "உங்கள் முதல் சரிபார்க்கப்பட்ட மனிதாபிமான திட்டத்தை ஆதரிக்க பிரச்சாரங்களை ஆராயுங்கள்."
        },
        card: {
          support_label: "சபத ஆதரவு",
          cycle_suffix: "பணி சுழற்சி",
          gifts_verified: "சரிபார்க்கப்பட்ட நன்கொடைகள்",
          total_given: "மொத்தம் வழங்கியது",
          next_support: "அடுத்த ஆதரவு தேதி",
          stop_button: "சபதத்தை நிறுத்து",
          payments_unit: "கொடுப்பனவுகள்"
        },
        status: {
          active: "செயலில்",
          fulfilled: "நிறைவடைந்தது",
          cancelled: "ரத்து செய்யப்பட்டது",
          pending: "நிலுவையில் உள்ளது"
        }
      },
      donation_history: {
        header_badge: "சரிபார்க்கப்பட்ட பதிவுகள்",
        title_1: "என்",
        title_2: "நன்கொடைகள்",
        subtitle: "செய்யப்பட்ட ஒவ்வொரு பங்களிப்பையும் நிர்வகிக்கவும். ஒவ்வொரு பரிவர்த்தனையும் TransFund சரிபார்ப்பு தளம் மூலம் அங்கீகரிக்கப்படுகிறது.",
        total_impact_label: "மொத்த தாக்கம்",
        profile_verification: {
          title: "சுயவிவர சரிபார்ப்பு தேவை",
          desc: "உங்கள் முழுமையான நன்கொடை வரலாறு மற்றும் ரசீதுகளை அணுக உங்கள் சுயவிவரத்தை முடிக்கவும்."
        },
        no_history: {
          title: "வரலாறு எதுவும் இல்லை",
          desc: "நீங்கள் இன்னும் எந்த பரிவர்த்தனையும் செய்யவில்லை எனத் தெரிகிறது. உங்கள் தாக்கம் இங்கே பதிவு செய்யப்படும்."
        },
        active_commitments: "செயலில் உள்ள மூலோபாய அர்ப்பணிப்புகள்",
        impact_registry: "தாக்கப் பதிவேடு",
        card: {
          strategy_suffix: "மூலோபாயம்",
          ref_id: "குறிப்பு ஐடி",
          status_label: "நிலை",
          active_status: "செயலில்",
          method_label: "கட்டண முறை",
          project_label: "ஆதரிக்கப்படும் திட்டம்",
          general_fund: "பொது நிதி மையம்",
          receipt: "சரிபார்க்கப்பட்ட ரசீது",
          status_verified: "சரிபார்க்கப்பட்டது"
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

import React, { useState, useEffect, useCallback } from "react";
import { Form, Tabs, message } from "antd";
import { apiClient } from "@/utils/api";
import { useGA4Analytics } from "@/hooks/useGA4Analytics";
import { getEmailFromToken } from "@/providers/auth/tokenUtils";
import { checkUserExists } from "@/services/userService";
import Header from "../Header";
import SuccessModal from "./SuccessModal";
import FormLoading from "./components/FormLoading";
import FormHeader from "./components/FormHeader";
import FormNavigation from "./components/FormNavigation";
import { createTabItems } from "./config/tabConfig";
import { TAB_FIELDS_MAP } from "./constants";
const PitchTankForm: React.FC = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingEntry, setHasExistingEntry] = useState(false);
  const [initialValues, setInitialValues] = useState<Record<string, unknown>>({});
  const [maxAccessibleTab, setMaxAccessibleTab] = useState(1);
  const { trackButtonClick } = useGA4Analytics({
    trackPageViews: false,
    trackUserEngagement: false,
  });

  // Get current user
  const getCurrentUser = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };

  // Initialize authentication from cookie (for cross-domain navigation)
  const initializeAuthFromCookie = useCallback(async () => {
    // Skip if already have token and user
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
      return true;
    }

    try {
      // Fetch token from httpOnly cookie
      const tokenResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002'}/auth/google/token`,
        { 
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        }
      );

      if (!tokenResponse.ok) {
        message.warning('Please log in to access the Pitch Tank form');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
        return false;
      }

      const tokenData = await tokenResponse.json();
      
      if (tokenData.token) {
        // Store token
        localStorage.setItem('token', tokenData.token);
        
        // Get email from token
        const email = getEmailFromToken(tokenData.token);
        if (!email) {
          throw new Error('Invalid token format');
        }
        
        // Fetch user data using check-user endpoint
        const userResponse = await checkUserExists(email);
        if (userResponse.exists && userResponse.user) {
          const userData = {
            id: userResponse.user.user_id,
            email: userResponse.user.email,
            name: userResponse.user.full_name,
            role: userResponse.user.role,
            createdAt: userResponse.user.created_at,
            updatedAt: userResponse.user.updated_at,
            isOnboarded: userResponse.user.is_onboarded || false,
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('user_id', userData.id);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Failed to initialize authentication:', error);
      message.error('Authentication failed. Please log in again.');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return false;
    }
  }, []);

  // Determine max accessible tab based on existing data
  const determineMaxAccessibleTab = (formValues: Record<string, unknown>) => {
    let maxTab = 1;
    
    // Check each tab sequentially to find the highest tab with data
    for (let tabNum = 1; tabNum <= 8; tabNum++) {
      const tabKey = tabNum.toString();
      const fields = TAB_FIELDS_MAP[tabKey] || [];
      
      const hasData = fields.some(field => {
        const value = formValues[field];
        return value !== undefined && value !== null && value !== "" && 
               (!Array.isArray(value) || value.length > 0);
      });
      
      if (hasData) {
        maxTab = Math.max(maxTab, tabNum + 1); // Allow access to next tab if current has data
      }
    }
    
    return Math.min(maxTab, 8); // Cap at tab 8
  };

  // Fetch and prefill data
  const fetchFormData = useCallback(async () => {
    const user = getCurrentUser();
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.get(
        `/api/waitlist/pitch-tank/user/${user.id}`
      );

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const existingData = response.data[0];
        const formValues = transformApiDataToFormData(existingData);
        setInitialValues(formValues);
        form.setFieldsValue(formValues);
        setHasExistingEntry(true);
        
        // Prefill localStorage pitch_deck_url if backend has one
        try {
          const deckUrl = (existingData as any)?.pitch_deck_url || (existingData as any)?.deck_url;
          if (deckUrl && typeof deckUrl === 'string') {
            localStorage.setItem('pitch_deck_url', deckUrl);
            // Auto-select "Yes" for hasPitchDeck and set the URL in the form
            form.setFieldValue('hasPitchDeck', 'yes');
            form.setFieldValue('pitch_deck_url', deckUrl);
          }
        } catch {}
        
        // Determine max accessible tab based on existing data
        const maxTab = determineMaxAccessibleTab(formValues);
        setMaxAccessibleTab(maxTab);
      } else {
        setHasExistingEntry(false);
      }
    } catch (error) {
      console.error("Error fetching form data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  // Transform API data to form format
  const transformApiDataToFormData = (data: Record<string, unknown>) => {
    const parseJsonField = (field: unknown, fallback: unknown = null) => {
      if (!field) return fallback;
      if (Array.isArray(field)) return field;
      if (typeof field === "string") {
        try {
          return JSON.parse(field);
        } catch {
          return fallback;
        }
      }
      return field;
    };

    return {
      // Tab 1: Founder & Startup Basics
      fullName: data.full_name || "",
      email: data.contact_email || "",
      phone: data.phone || "",
      startupName: data.startup_project_name || "",
      pitch: data.one_line_pitch || "",
      website: data.website_primary_link || "",
      socialProductLinks: parseJsonField(data.social_product_links, []),
      stage: data.current_stage || "",
      
      // Fashion-specific fields (conditional)
      isFashionBusiness: data.is_fashion_business === "true" || data.is_fashion_business === true || false,
      fashionBrandStory: data.fashion_brand_story || "",
      fashionDesignPhilosophy: data.fashion_design_philosophy || "",
      fashionSustainability: data.fashion_sustainability || "",
      
      sector: data.sector_vertical || "",
      location: data.where_based || "",
      
      // Pitch deck URL if available
      pitch_deck_url: data.pitch_deck_url || data.deck_url || "",
      hasPitchDeck: (data.pitch_deck_url || data.deck_url) ? "yes" : undefined,

      // Tab 2: Problem & Solution
      problemDescription: data.problem_solving || "",
      targetCustomer: data.who_experiences_problem || "",
      solutionDescription: data.solution_description || "",

      // Tab 3: Market & Differentiation
      marketOpportunity: data.opportunity_size || "",
      competitionDifferentiation: data.competition_differentiation || "",
      marketTiming: data.why_now || "",

      // Tab 4: Traction & Validation
      tractionEvidence: data.proof_people_want || "",
      preTractionExperiments: data.pre_traction_experiments || "",
      // Convert key_metrics (array of strings) -> key_metrics_input (array of objects)
      key_metrics_input: (() => {
        const raw = parseJsonField(data.key_metrics, []);
        if (!Array.isArray(raw)) return [] as Array<{ metric: string; value: string }>;

        const isNumericish = (s: string) => /[0-9]/.test(s);

        return raw
          .map((entry: unknown) => {
            if (entry && typeof entry === 'object' && 'metric' in (entry as any) && 'value' in (entry as any)) {
              const e = entry as { metric: string; value: string };
              return { metric: String(e.metric || '').trim(), value: String(e.value || '').trim() };
            }
            if (typeof entry === 'string') {
              const text = entry.trim().replace(/\s+/g, ' ');
              const parts = text.split(' ');
              if (parts.length === 1) {
                // Only a label, no numeric value
                return { value: '', metric: parts[0] };
              }

              const first = parts[0];
              const last = parts[parts.length - 1];
              const middle = parts.slice(1, -1).join(' ');

              // Heuristics:
              // - If first chunk is numericish (e.g., "150000" or "$150k"), treat first..middle as value and last as metric
              // - Else if last chunk is numericish (e.g., "MRR 150000"), treat first..middle as metric and last as value
              // - Else default to value=all-but-last, metric=last
              if (isNumericish(first) && !isNumericish(last)) {
                return { value: [first, middle].filter(Boolean).join(' ').trim(), metric: last };
              }
              if (!isNumericish(first) && isNumericish(last)) {
                return { value: last, metric: [first, middle].filter(Boolean).join(' ').trim() };
              }
              return { value: parts.slice(0, -1).join(' ').trim(), metric: last };
            }
            return null;
          })
          .filter(Boolean) as Array<{ metric: string; value: string }>;
      })(),

      // Tab 5: Team
      uniquePositioning: data.uniquely_positioned || "",
      // Convert team_members (array of objects) -> team_members_input
      team_members_input: (() => {
        const raw = parseJsonField(data.team_members, []);
        if (!Array.isArray(raw)) return [] as Array<{ name: string; role: string; background: string; linkedin?: string }>;
        return raw
          .map((member: any) => {
            if (!member || typeof member !== 'object') return null;
            return {
              name: String(member.name || '').trim(),
              role: String(member.role || '').trim(),
              background: String(member.background || '').trim(),
              linkedin: member.linkedin ? String(member.linkedin).trim() : ''
            };
          })
          .filter(Boolean) as Array<{ name: string; role: string; background: string; linkedin?: string }>;
      })(),

      // Tab 6: Vision & Ambition
      longTermVision: data.long_term_vision || "",
      fiveYearOutlook: data.five_year_vision || "",

      // Tab 7: Growth & Support Needs
      creativeGrowthStrategy: data.creative_growth_idea || "",
      fundingAmount: data.funding_amount || "",
      supportNeeded: parseJsonField(data.help_needed_areas, []),
      pitchVideoUrl: data.video_file || "",
      // Convert references (array of strings like "Name, Relationship") -> references_input
      references_input: (() => {
        const raw = parseJsonField(data.references, []);
        if (!Array.isArray(raw)) return [] as Array<{ name: string; relationship: string; email?: string; phone?: string; linkedin?: string }>;
        return raw
          .map((r: unknown) => {
            if (typeof r === 'string') {
              const parts = r.split(',');
              const name = parts[0]?.trim() || '';
              const relationship = parts.slice(1).join(',').trim() || '';
              return { name, relationship };
            }
            if (r && typeof r === 'object') {
              const ref = r as { name?: string; relationship?: string; email?: string | null; phone?: string | null; linkedin?: string | null };
              return {
                name: String(ref.name || '').trim(),
                relationship: String(ref.relationship || '').trim(),
                ...(ref.email ? { email: String(ref.email).trim() } : {}),
                ...(ref.phone ? { phone: String(ref.phone).trim() } : {}),
                ...(ref.linkedin ? { linkedin: String(ref.linkedin).trim() } : {}),
              };
            }
            return null;
          })
          .filter(Boolean) as Array<{ name: string; relationship: string; email?: string; phone?: string; linkedin?: string }>;
      })(),

      // Tab 8: Review & Submit
      termsAgreement:
        data.terms_agreement === "true" || data.terms_agreement === true,
    };
  };

  // Validate current tab
  const validateCurrentTab = async () => {
    const tabFields = TAB_FIELDS_MAP[activeTab] || [];
    try {
      await form.validateFields(tabFields);
      
      // Custom validation for pitch deck upload
      if (activeTab === '1') {
        const hasPitchDeck = form.getFieldValue('hasPitchDeck');
        const pitchDeckUrl = form.getFieldValue('pitch_deck_url') || localStorage.getItem('pitch_deck_url');
        
        if (hasPitchDeck === 'yes' && !pitchDeckUrl) {
          message.error("Please upload your pitch deck before proceeding.");
          return false;
        }
      }
      
      return true;
    } catch (error) {
      message.error("Please fill in all required fields before proceeding.");
      return false;
    }
  };

  // Submit tab data
  const submitTabData = async () => {
    const user = getCurrentUser();
    if (!user?.id) {
      message.error("User authentication required");
      return false;
    }

    try {
      setIsSubmitting(true);
      const formValues = form.getFieldsValue();
      let payload: Record<string, unknown> = {};

      // Build payload ONLY for the active tab to avoid resetting other tabs
      switch (activeTab) {
        case "1": {
          payload = {
            full_name: formValues.fullName,
            contact_email: formValues.email,
            phone: formValues.phone,
            startup_project_name: formValues.startupName,
            one_line_pitch: formValues.pitch,
            website_primary_link: formValues.website,
            social_product_links: formValues.socialProductLinks,
            current_stage: formValues.stage,
            sector_vertical: formValues.sector,
            where_based: formValues.location,
            is_fashion_business: formValues.isFashionBusiness || false,
            // Include pitch deck url if present on form or in localStorage (supports deck_url)
            ...(formValues.pitch_deck_url ? { pitch_deck_url: formValues.pitch_deck_url } :
              (localStorage.getItem('pitch_deck_url') || localStorage.getItem('deck_url')
                ? { pitch_deck_url: localStorage.getItem('pitch_deck_url') || localStorage.getItem('deck_url') }
                : {})),
            ...(formValues.isFashionBusiness && {
              fashion_brand_story: formValues.fashionBrandStory || '',
              fashion_design_philosophy: formValues.fashionDesignPhilosophy || '',
              fashion_sustainability: formValues.fashionSustainability || '',
            }),
          };
          break;
        }
        case "2": {
          payload = {
            problem_solving: formValues.problemDescription,
            who_experiences_problem: formValues.targetCustomer,
            solution_description: formValues.solutionDescription,
          };
          break;
        }
        case "3": {
          payload = {
            opportunity_size: formValues.marketOpportunity,
            competition_differentiation: formValues.competitionDifferentiation,
            why_now: formValues.marketTiming,
          };
          break;
        }
        case "4": {
          const keyMetrics = Array.isArray(formValues.key_metrics_input)
            ? formValues.key_metrics_input
                .filter((item: { metric: string; value: string }) => item.metric && item.value)
                .map((item: { metric: string; value: string }) => ({ value: item.value, metric: item.metric }))
            : undefined;

          payload = {
            proof_people_want: formValues.tractionEvidence,
            pre_traction_experiments: formValues.preTractionExperiments,
            ...(keyMetrics && keyMetrics.length > 0 ? { key_metrics: keyMetrics } : {}),
          };
          break;
        }
        case "5": {
          const teamMembers = Array.isArray(formValues.team_members_input)
            ? formValues.team_members_input
                .filter((member: { name: string; role: string; background: string; linkedin?: string }) =>
                  member.name && member.role && member.background)
                .map((member: { name: string; role: string; background: string; linkedin?: string }) => ({
                  name: member.name,
                  role: member.role,
                  background: member.background,
                  linkedin: member.linkedin || '',
                }))
            : undefined;

          payload = {
            uniquely_positioned: formValues.uniquePositioning,
            ...(teamMembers && teamMembers.length > 0 ? { team_members: teamMembers } : {}),
          };
          break;
        }
        case "6": {
          payload = {
            long_term_vision: formValues.longTermVision,
            five_year_vision: formValues.fiveYearOutlook,
          };
          break;
        }
        case "7": {
          const references = Array.isArray(formValues.references_input)
            ? formValues.references_input
                .filter((ref: { name: string; relationship: string; email?: string; phone?: string; linkedin?: string }) =>
                  ref.name && ref.relationship)
                .map((ref: { name: string; relationship: string; email?: string; phone?: string; linkedin?: string }) => ({
                  name: ref.name,
                  relationship: ref.relationship,
                  ...(ref.email ? { email: ref.email } : {}),
                  ...(ref.phone ? { phone: ref.phone } : {}),
                  ...(ref.linkedin ? { linkedin: ref.linkedin } : {}),
                }))
            : undefined;

          payload = {
            creative_growth_idea: formValues.creativeGrowthStrategy,
            funding_amount: formValues.fundingAmount,
            help_needed_areas: formValues.supportNeeded,
            ...(references && references.length > 0 ? { references } : {}),
          };
          break;
        }
        case "8": {
          payload = {
            terms_agreement: formValues.termsAgreement,
            ...(formValues.pitch_deck_url ? { pitch_deck_url: formValues.pitch_deck_url } :
              (localStorage.getItem('pitch_deck_url') || localStorage.getItem('deck_url')
                ? { pitch_deck_url: localStorage.getItem('pitch_deck_url') || localStorage.getItem('deck_url') }
                : {})),
          };
          break;
        }
        default:
          payload = {};
      }

      // Prepare form data
      const formData = new FormData();
      const payloadWithUserId = {
        ...payload,
        user_id: user.id,
      };

      console.log("payloadWithUserId", payloadWithUserId);

      // Convert payload to FormData
      Object.entries(payloadWithUserId).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Handle pitch video URL (optional)
      formData.set('video_link', formValues.pitchVideoUrl ? formValues.pitchVideoUrl : 'Not Provided');

      // Use PUT if an entry already exists; otherwise POST only on first tab
      if (activeTab === "1" && !hasExistingEntry) {
        try {
          await apiClient.postFormData("/api/waitlist/pitch-tank", formData);
          setHasExistingEntry(true);
        } catch (err: any) {
          // If backend returns duplicate/conflict, fallback to PUT
          const status = err?.response?.status;
          if (status === 409 || status === 400) {
            await apiClient.putFormData(`/api/waitlist/pitch-tank/user/${user.id}`, formData);
            setHasExistingEntry(true);
          } else {
            throw err;
          }
        }
      } else {
        // Update existing entry for subsequent tabs or when entry already exists
        await apiClient.putFormData(`/api/waitlist/pitch-tank/user/${user.id}`, formData);
      }

      message.success("Data saved successfully");
      return true;
    } catch (error) {
      console.error("Error submitting tab data:", error);
      message.error("Failed to save data. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation handlers
  const handleNext = async () => {
    const hasPitchDeckChoice = form.getFieldValue("hasPitchDeck");
    const nextTabNumber = Math.min(parseInt(activeTab, 10) + 1, 8);
    const targetTab = hasPitchDeckChoice === "yes" ? "8" : nextTabNumber.toString();

    trackButtonClick("pitch_tank_form_next", "pitch_tank_form", {
      button_location: `pitch_tank_form_tab_${activeTab}`,
      button_type: "primary",
      user_action: "next_click",
      form_step: activeTab,
      next_step: targetTab,
      has_pitch_deck: hasPitchDeckChoice === "yes",
    });

    const isValid = await validateCurrentTab();
    if (!isValid) return;

    const success = await submitTabData();
    if (!success) return;

    if (hasPitchDeckChoice === "yes") {
      setActiveTab("8");
      return;
    }

    if (parseInt(activeTab, 10) < 8) {
      // Allow access to next tab
      setMaxAccessibleTab((prev) => Math.max(prev, nextTabNumber));
      
      // Navigate to next tab
      setActiveTab(targetTab);
    }
  };

  const handlePrevious = () => {
    const hasPitch = form.getFieldValue('hasPitchDeck');
    if (hasPitch === 'yes' && activeTab === '8') {
      setActiveTab('1');
      return;
    }
    if (parseInt(activeTab) > 1) {
      setActiveTab((parseInt(activeTab) - 1).toString());
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await form.validateFields();

      const user = getCurrentUser();
      if (!user?.id) {
        message.error("User authentication required");
        return;
      }

      const formValues = form.getFieldsValue();
      const finalPayload = {
        ...formValues,
        ...(formValues.pitch_deck_url ? { pitch_deck_url: formValues.pitch_deck_url } :
          (localStorage.getItem('pitch_deck_url') || localStorage.getItem('deck_url')
            ? { pitch_deck_url: localStorage.getItem('pitch_deck_url') || localStorage.getItem('deck_url') }
            : {})),
        user_id: user.id,
      };
      // Final submit should not create duplicates; use JSON PUT/POST instead of multipart
      if (hasExistingEntry) {
        await apiClient.put(`/api/waitlist/pitch-tank/user/${user.id}`, finalPayload);
      } else {
        try {
          await apiClient.post("/api/waitlist/pitch-tank", finalPayload);
          setHasExistingEntry(true);
        } catch (err: any) {
          const status = err?.response?.status;
          if (status === 409 || status === 400) {
            await apiClient.put(`/api/waitlist/pitch-tank/user/${user.id}`, finalPayload);
            setHasExistingEntry(true);
          } else {
            throw err;
          }
        }
      }

      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize auth from cookie first, then load form data
  useEffect(() => {
    const initializeForm = async () => {
      await initializeAuthFromCookie();
      await fetchFormData();
    };
    initializeForm();
  }, [initializeAuthFromCookie, fetchFormData]);

  // Dynamic tabs based on pitch deck choice
  const hasPitchDeckChoice = Form.useWatch('hasPitchDeck', form);
  const pitchDeckTick = Form.useWatch('pitchDeckTempTick', form);
  const isPitchDeckUploaded = Boolean(localStorage.getItem('pitch_deck_url'));
  const allTabItems = createTabItems(form, maxAccessibleTab);
  const tabItems = (() => {
    if (hasPitchDeckChoice === 'yes') {
      const tab1 = allTabItems.find((t: any) => t.key === '1');
      const tab8 = allTabItems.find((t: any) => t.key === '8');
      return [tab1, tab8].filter(Boolean) as any[];
    }
    return allTabItems;
  })();

  // Auto-redirect to Review & Submit only after a new upload (pitchDeckTick changes on upload)
  useEffect(() => {
    if (isPitchDeckUploaded && hasPitchDeckChoice === 'yes' && pitchDeckTick && activeTab !== '8') {
      setActiveTab('8');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pitchDeckTick]);

  if (isLoading) {
    return <FormLoading />;
  }

  // Simplest approach: Use Ant Design's onChange with validation
  const handleTabChange = (newActiveKey: string) => {
    const newTabNumber = parseInt(newActiveKey);
    
    // Allow switching only to accessible tabs
    if (newTabNumber <= maxAccessibleTab) {
      setActiveTab(newActiveKey);
    } else {
      message.warning("Please complete the previous tabs first.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <FormHeader />

        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSubmit}
          className="bg-white rounded-lg shadow-sm"
        >
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
            type="line"
            className="px-6"
            renderTabBar={() => <></>}
            size="large"
          />

          <div className="p-6 pt-0">
            <FormNavigation
              activeTab={activeTab}
              isSubmitting={isSubmitting}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
            />
          </div>
        </Form>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};

export default PitchTankForm;

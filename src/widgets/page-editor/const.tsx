import { Button } from "@/components/ui/button";
import Media from "@/features/editor/ui/media";
import PageMobileHeader from "@/features/funnel-components/Header/PageMobileHeader";
import { Progress } from "@/features/funnel-components/Progress/Progress";
import MultiSelectCheckbox from "@/features/funnel-components/Select/ui/MultiSelectMain";
import SingleSelectMain from "@/features/funnel-components/Select/ui/SingleSelectMain";
import SingleSelectNumericRate from "@/features/funnel-components/Select/ui/SingleSelectNumericRate";
import SingleSelectRectangle from "@/features/funnel-components/Select/ui/SingleSelectRectangle";
import { LottiePlayerSrc } from "@/features/lottie";
import * as mdx from "@mdx-js/react";
export const COMPONENTS: React.ComponentProps<
  typeof mdx.MDXProvider
>["components"] = {
  SingleRatingNumeric: (props: { options: string }) => {
    const options = JSON.parse(props.options) as {
      label: string;
      value: string;
    }[];
    return (
      <>
        <SingleSelectNumericRate
          options={options.map((option) => ({
            title: option.label,
            custom_id: option.value,
          }))}
          selectedOptionId={undefined}
          onChangeOption={() => {}}
        />
        <div className="mx-auto mt-4 flex max-w-[450px] items-center justify-between text-[#737E8C]">
          <span className="text-inherit">not at all</span>
          <span className="text-inherit">completely</span>
        </div>
      </>
    );
  },
  SingleSelectRectangle: (props: { options: string }) => {
    const options = JSON.parse(props.options) as {
      label: string;
      value: string;
      file: string;
    }[];
    return (
      <SingleSelectRectangle
        options={options.map((option) => ({
          title: option.label,
          custom_id: option.value,
          file: option.file,
        }))}
        selectedOptionId={undefined}
        onChangeOption={() => {}}
      />
    );
  },
  Lottie: (props) => {
    return <LottiePlayerSrc autoplay keepLastFrame src={props.src} />;
  },

  Desktop: (props) => {
    return <div className="hidden md:block">{props.children}</div>;
  },
  Image: Media,
  FooterButton: (props) => {
    return <Button>{props.text}</Button>;
  },
  PageHeader: PageMobileHeader,
  Progress: Progress,
  SingleDefaultQuiz: (props: { options: string }) => {
    const options = JSON.parse(props.options) as {
      label: string;
      value: string;
    }[];
    return (
      <SingleSelectMain
        options={options.map((option) => ({
          title: option.label,
          custom_id: option.value,
        }))}
        selectedOptionId={undefined}
        onChangeOption={() => {}}
      />
    );
  },
  MultiSelectCheckbox: (props: { options: string }) => {
    const options = JSON.parse(props.options) as {
      label: string;
      value: string;
    }[];
    return (
      <MultiSelectCheckbox
        options={options.map((option) => ({
          title: option.label,
          custom_id: option.value,
        }))}
        selectedOptionIds={[]}
        onChangeOption={() => {}}
      />
    );
  },
};

export const DEFAULT_USER = {
  ab_test_36: "control",
  token: "guest-token-xyz",
  upsell_chase: false,
  ab_test_50: "variantA",
  ab_test_54: "control",
  ab_test_59: "variantB",
  selectedPlanId: 1,
  id: 0,
  gender: "prefer not to say",
  age: "25-34",
  goal: "Learn new skills",
  preferedWorkload: "10-20 hrs/week",
  marketing_skills: 5,
  writing_skills: 7,
  coding_experience: "Beginner",
  status: "active",
  name: "Jane Doe",
  discount: { type: "none", amount: 0 },
  domain: "productivity",
  paywall: "lite",
  funnel_version: "v2",
  quiz_version: "2025-07",
  selling_version: undefined,
  email: "jane.doe@example.com",
  job_role: "Content Creator",
  hours_day: "2",
  interests: ["writing", "productivity", "tech"],
  part_time: "No, I haven't considered it",
  challenges: ["time management", "finding clients"],
  familiar_ai: "I've heard of them but don't know much",
  ai_freelance: "I've heard but not very familiar",
  online_before: "No, I don't know where to start",
  clients_methods: "No, I want to know",
  ai_tools: ["ChatGPT", "Midjourney"],
  ai_automation: "No, I want to know",
  income_range: "$0–$999",
  hours_desired: "10 min/day",
  current_income: "$0",
  income_desired: "$500–$999",
  vacation: "2 weeks/year",
  money_plan: "Save a little each month",
  money_goal: "Build an emergency fund",
  reason_money: "Financial security",
  geolocation: {
    lat: 51.5074,
    lng: -0.1278,
    test_us: "A",
    deviceId: "device-12345",
    referer: "https://example.com",
    school: "Creative subjects like art, writing, or music",
    pleasant:
      "Writing content or messages (e.g., blogs, essays, or social media captions)",
    handle:
      "Writing content (e.g., blog posts, emails, or social media captions)",
    analyze: "Agree",
    online: "Neutral",
    commission: "Disagree",
    creative: "Agree",
    writing: "Strongly Agree",
    viral: "Neutral",
    quickly: "Agree",
    utm_source: "newsletter",
    utm_medium: "email",
    utm_adset: "",
    utm_campaign: "summer_sale",
    cohort_date: "2025-07-01",
    email_consent: "granted",
    utm_content: "",
    utm_term: "",
    utm_placement: "header",
    utm_id: "123abc",
    utm_ad: "welcome_ad",
    country_code: "GB",
    utm_keyword: "skill+learning",
    utm_adgroupid: "grp-456",
  },
};

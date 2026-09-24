export type MarketingAgentRole =
  | "cmo"
  | "brand_strategist"
  | "copywriter"
  | "virtual_asset"
  | "growth_ops";

export type SocialNetwork = "both" | "instagram" | "facebook" | "whatsapp" | "linkedin" | "tiktok";

export type MarketingTaskType =
  // CMO
  | "full_launch_strategy"
  | "campaign_brief"
  | "niche_attack_plan"
  // Brand & Identity
  | "profile_bios"
  | "content_pillars"
  | "highlight_stories"
  | "brand_manifesto"
  // Copywriter
  | "foundational_grid_posts"
  | "single_post"
  | "reel_tiktok_script"
  | "meta_ads_copy"
  | "carousel_slides"
  // Virtual Asset
  | "social_banner_prompt"
  | "storyboard_video"
  | "ui_mockup_prompt"
  | "highlight_icons"
  // Growth Ops
  | "whatsapp_deep_links"
  | "whatsapp_catalog_setup"
  | "outbound_audit_script"
  | "launch_calendar";

export interface MarketingAgentRequest {
  role: MarketingAgentRole;
  task: MarketingTaskType;
  network?: SocialNetwork;
  niche?: "clinicas_odontologicas" | "retail_moda" | "b2b_industrial" | "inmobiliarias" | "general";
  customInstructions?: string;
  targetAudience?: string;
  contextData?: Record<string, any>;
  customApiKey?: string;
}

export interface MarketingAgentResponse {
  success: boolean;
  role: MarketingAgentRole;
  task: MarketingTaskType;
  title: string;
  content: string;
  metadata?: {
    suggestedFormat?: string;
    targetNetwork?: string;
    estimatedReadTime?: string;
    actionableSteps?: string[];
  };
  error?: string;
}

export type Course = {
  categoryIds: unknown[];
  courseStatus: string;
  description: string;
  enrollableSiteUserRoles: unknown[];
  estimatedWorkload: string;
  id: string;
  instructorIds: string[];
  isReal: boolean;
  isRestrictedMembership: boolean;
  isSubtitleTranslationEnabled: boolean;
  isVerificationEnabled: boolean;
  launchedAt: number;
  name: string;
  partnerIds: string[];
  previewUserIds: unknown[];
  primaryLanguageCodes: string[];
  promoPhoto: string;
  slug: string;
  subtitleLanguageCodes: string[];
  verificationEnabledAt: number;
};

export type Source = {
  src: string;
  type: string;
};

// not fully typed
export type PlayerCache = {
  duration: number;
  currentTime: number;
  volume: number;
  // it's better to get the source from the player opts
  source: Source | undefined;
  sources: Source[];
};

export type Track = {
  kind: "captions";
  label: string;
  src: string;
  srclang: string;
};

// not fully typed
export type PlayerOptions = {
  // it also contains localized names, etc., but it is useless for us
  courseId: string;
  sources: Source[];
  tracks: Track[];
};

// not fully typed
export type PlayerData = {
  cache_: PlayerCache;
  options_: PlayerOptions;
};

export type CourseData = {
  elements: [
    {
      isReal: boolean;
      certificatePurchaseEnabledAt: number;
      estimatedWorkload: string;
      description: string;
      isRestrictedMembership: boolean;
      domainTypes: unknown;
      verificationEnabledAt: number;
      isVerificationEnabled: boolean;
      sessionsEnabledAt: number;
      brandingImage: string;
      previewUserIds: unknown[];
      id: string;
      slug: string;
      instructorIds: string[];
      subtitleLanguageCodes: string[];
      enrollableSiteUserRoles: unknown[];
      promoPhoto: string;
      primaryLanguageCodes: string[];
      partnerIds: string[];
      categoryIds: unknown[];
      isSubtitleTranslationEnabled: boolean;
      name: string;
      courseStatus: "launched";
      launchedAt: number;
      overridePartnerLogos: unknown;
    },
  ];
  paging: unknown;
  links: unknown;
  linked: unknown;
};

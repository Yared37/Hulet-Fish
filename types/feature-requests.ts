// Feature request types for the platform

export interface FeatureRequest {
  id: string
  title: string
  description: string
  category: FeatureCategory
  priority: Priority
  status: FeatureStatus
  requestedBy: {
    userId: string
    userType: "tourist" | "host" | "admin"
    name: string
    email: string
  }
  votes: number
  estimatedEffort: EstimatedEffort
  businessValue: BusinessValue
  technicalComplexity: TechnicalComplexity
  dependencies: string[]
  createdAt: Date
  updatedAt: Date
  targetRelease?: string
  assignedTo?: string
  comments: FeatureComment[]
}

export type FeatureCategory =
  | "user-experience"
  | "payment-system"
  | "communication"
  | "analytics"
  | "mobile"
  | "ai-ml"
  | "security"
  | "integration"
  | "performance"
  | "accessibility"

export type Priority = "critical" | "high" | "medium" | "low"

export type FeatureStatus =
  | "requested"
  | "under-review"
  | "approved"
  | "in-development"
  | "testing"
  | "deployed"
  | "rejected"

export type EstimatedEffort = "small" | "medium" | "large" | "extra-large"

export type BusinessValue = "low" | "medium" | "high" | "critical"

export type TechnicalComplexity = "simple" | "moderate" | "complex" | "very-complex"

export interface FeatureComment {
  id: string
  userId: string
  userName: string
  comment: string
  createdAt: Date
}

// Specific feature implementations

export interface MessagingSystemFeature {
  realTimeChat: boolean
  fileSharing: boolean
  voiceMessages: boolean
  videoCall: boolean
  translation: boolean
  pushNotifications: boolean
  messageEncryption: boolean
  messageHistory: boolean
}

export interface AIRecommendationFeature {
  personalizedSuggestions: boolean
  smartItinerary: boolean
  priceOptimization: boolean
  weatherIntegration: boolean
  culturalMatching: boolean
  demandForecasting: boolean
  contentGeneration: boolean
}

export interface PaymentEnhancementFeature {
  splitPayments: boolean
  installmentPlans: boolean
  localPaymentMethods: string[]
  cryptocurrencySupport: boolean
  automaticRefunds: boolean
  dynamicPricing: boolean
  multiCurrencySupport: boolean
}

export interface MobileAppFeature {
  nativeApps: boolean
  offlineCapabilities: boolean
  gpsNavigation: boolean
  augmentedReality: boolean
  pushNotifications: boolean
  biometricAuth: boolean
  voiceCommands: boolean
}

export interface VRIntegrationFeature {
  experiencePreviews: boolean
  virtualTours: boolean
  remoteWorkshops: boolean
  mixedReality: boolean
  vrEquipmentRental: boolean
  immersiveBooking: boolean
}

export interface BlockchainFeature {
  experienceNFTs: boolean
  verifiedReviews: boolean
  smartContracts: boolean
  tokenRewards: boolean
  heritageTokenization: boolean
  decentralizedIdentity: boolean
}

export interface SustainabilityFeature {
  carbonTracking: boolean
  ecoFriendlyBadges: boolean
  impactMeasurement: boolean
  sustainabilityCertification: boolean
  communityBenefitTracking: boolean
  greenTransportation: boolean
}

export interface AnalyticsFeature {
  revenueForecasting: boolean
  userBehaviorInsights: boolean
  marketTrendAnalysis: boolean
  performanceBenchmarking: boolean
  customDashboards: boolean
  predictiveAnalytics: boolean
  realTimeMetrics: boolean
}

// Feature voting and feedback system
export interface FeatureVote {
  featureId: string
  userId: string
  vote: "up" | "down"
  createdAt: Date
}

export interface FeatureFeedback {
  featureId: string
  userId: string
  feedback: string
  rating: number
  createdAt: Date
}

// Feature implementation tracking
export interface FeatureImplementation {
  featureId: string
  developmentPhase: DevelopmentPhase
  progressPercentage: number
  milestones: Milestone[]
  blockers: Blocker[]
  estimatedCompletion: Date
  actualCompletion?: Date
}

export type DevelopmentPhase = "planning" | "design" | "development" | "testing" | "deployment" | "monitoring"

export interface Milestone {
  id: string
  title: string
  description: string
  dueDate: Date
  completed: boolean
  completedAt?: Date
}

export interface Blocker {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  createdAt: Date
  resolvedAt?: Date
}

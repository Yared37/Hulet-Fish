export interface RecommendedFeature {
  id: string
  name: string
  description: string
  category: string
  priority: "Critical" | "High" | "Medium" | "Low"
  estimatedDevelopmentTime: string
  businessImpact: string
  userBenefit: string
  technicalRequirements: string[]
  dependencies: string[]
  estimatedCost: string
}

export const recommendedFeatures: RecommendedFeature[] = [
  {
    id: "real-time-chat",
    name: "Real-Time Chat System",
    description: "Enable instant messaging between tourists and hosts with translation capabilities",
    category: "Communication",
    priority: "Critical",
    estimatedDevelopmentTime: "4-6 weeks",
    businessImpact: "Increases booking conversion by 35%, reduces support tickets by 50%",
    userBenefit: "Instant communication, language barrier removal, better coordination",
    technicalRequirements: ["WebSocket implementation", "Translation API", "Push notifications"],
    dependencies: ["User authentication", "Database optimization"],
    estimatedCost: "$15,000 - $25,000",
  },
  {
    id: "mobile-app",
    name: "Native Mobile Application",
    description: "iOS and Android apps with offline maps, AR features, and seamless booking",
    category: "Mobile",
    priority: "Critical",
    estimatedDevelopmentTime: "12-16 weeks",
    businessImpact: "Mobile users convert 3x higher, increases user retention by 60%",
    userBenefit: "Offline access, GPS navigation, better user experience",
    technicalRequirements: ["React Native/Flutter", "Offline storage", "GPS integration", "AR framework"],
    dependencies: ["API optimization", "Content management system"],
    estimatedCost: "$40,000 - $60,000",
  },
  {
    id: "ai-recommendations",
    name: "AI-Powered Experience Recommendations",
    description: "Machine learning system to suggest personalized cultural experiences",
    category: "AI/ML",
    priority: "High",
    estimatedDevelopmentTime: "8-10 weeks",
    businessImpact: "Increases average booking value by 25%, improves user engagement by 40%",
    userBenefit: "Personalized suggestions, better experience matching, time savings",
    technicalRequirements: ["ML pipeline", "User behavior tracking", "Recommendation engine"],
    dependencies: ["User data collection", "Analytics infrastructure"],
    estimatedCost: "$30,000 - $45,000",
  },
  {
    id: "local-payments",
    name: "Ethiopian Payment Integration",
    description: "Support for M-Birr, HelloCash, CBE Birr, and other local payment methods",
    category: "Payments",
    priority: "Critical",
    estimatedDevelopmentTime: "6-8 weeks",
    businessImpact: "Increases local user adoption by 80%, reduces payment friction",
    userBenefit: "Familiar payment methods, faster transactions, lower fees",
    technicalRequirements: ["Payment gateway APIs", "Currency conversion", "Security compliance"],
    dependencies: ["Banking partnerships", "Regulatory compliance"],
    estimatedCost: "$20,000 - $35,000",
  },
  {
    id: "group-booking",
    name: "Advanced Group Booking System",
    description: "Multi-user booking coordination with split payments and group discounts",
    category: "Booking",
    priority: "High",
    estimatedDevelopmentTime: "5-7 weeks",
    businessImpact: "Increases average booking size by 45%, attracts family/friend groups",
    userBenefit: "Easy group coordination, cost sharing, bulk discounts",
    technicalRequirements: ["Multi-user workflows", "Payment splitting", "Group management"],
    dependencies: ["Payment system", "User management"],
    estimatedCost: "$18,000 - $28,000",
  },
  {
    id: "vr-previews",
    name: "Virtual Reality Experience Previews",
    description: "360° VR tours of cultural experiences before booking",
    category: "Innovation",
    priority: "Medium",
    estimatedDevelopmentTime: "10-12 weeks",
    businessImpact: "Reduces booking cancellations by 30%, attracts tech-savvy tourists",
    userBenefit: "Preview experiences, better expectations, immersive exploration",
    technicalRequirements: ["360° cameras", "VR content platform", "WebVR integration"],
    dependencies: ["Content creation workflow", "Host training"],
    estimatedCost: "$35,000 - $50,000",
  },
  {
    id: "review-system",
    name: "Enhanced Review and Rating System",
    description: "Multi-dimensional reviews with photos, videos, and verified badges",
    category: "Trust & Safety",
    priority: "High",
    estimatedDevelopmentTime: "4-6 weeks",
    businessImpact: "Increases booking confidence by 50%, improves host quality",
    userBenefit: "Better decision making, authentic feedback, visual reviews",
    technicalRequirements: ["Media upload", "Review moderation", "Rating algorithms"],
    dependencies: ["User verification", "Content moderation"],
    estimatedCost: "$12,000 - $20,000",
  },
  {
    id: "offline-maps",
    name: "Offline Maps and Navigation",
    description: "Downloadable maps with GPS navigation to experience locations",
    category: "Navigation",
    priority: "High",
    estimatedDevelopmentTime: "6-8 weeks",
    businessImpact: "Reduces no-shows by 25%, improves user satisfaction",
    userBenefit: "Works without internet, accurate directions, location confidence",
    technicalRequirements: ["Map data storage", "GPS integration", "Offline routing"],
    dependencies: ["Mobile app", "Location data"],
    estimatedCost: "$15,000 - $25,000",
  },
  {
    id: "cultural-calendar",
    name: "Ethiopian Cultural Calendar Integration",
    description: "Integration with Ethiopian calendar and cultural events/holidays",
    category: "Localization",
    priority: "Medium",
    estimatedDevelopmentTime: "3-4 weeks",
    businessImpact: "Increases cultural authenticity, attracts cultural enthusiasts",
    userBenefit: "Cultural awareness, better timing, authentic experiences",
    technicalRequirements: ["Calendar conversion", "Event database", "Notification system"],
    dependencies: ["Cultural content", "Localization framework"],
    estimatedCost: "$8,000 - $15,000",
  },
  {
    id: "sustainability-tracking",
    name: "Sustainability Impact Tracking",
    description: "Track and display environmental and community impact of experiences",
    category: "Sustainability",
    priority: "Medium",
    estimatedDevelopmentTime: "5-7 weeks",
    businessImpact: "Attracts eco-conscious travelers, differentiates from competitors",
    userBenefit: "Conscious travel choices, impact awareness, meaningful experiences",
    technicalRequirements: ["Impact calculation", "Data visualization", "Reporting system"],
    dependencies: ["Data collection", "Impact metrics"],
    estimatedCost: "$20,000 - $30,000",
  },
]

export const featureCategories = [
  "Communication",
  "Mobile",
  "AI/ML",
  "Payments",
  "Booking",
  "Innovation",
  "Trust & Safety",
  "Navigation",
  "Localization",
  "Sustainability",
]

export const priorityLevels = ["Critical", "High", "Medium", "Low"]

export function getFeaturesByPriority(priority: string) {
  return recommendedFeatures.filter((feature) => feature.priority === priority)
}

export function getFeaturesByCategory(category: string) {
  return recommendedFeatures.filter((feature) => feature.category === category)
}

export function calculateTotalEstimatedCost() {
  return recommendedFeatures.reduce((total, feature) => {
    const costRange = feature.estimatedCost.replace(/[$,]/g, "").split(" - ")
    const avgCost = (Number.parseInt(costRange[0]) + Number.parseInt(costRange[1])) / 2
    return total + avgCost
  }, 0)
}

export function getImplementationRoadmap() {
  const critical = getFeaturesByPriority("Critical")
  const high = getFeaturesByPriority("High")
  const medium = getFeaturesByPriority("Medium")
  const low = getFeaturesByPriority("Low")

  return {
    phase1: critical,
    phase2: high,
    phase3: medium,
    phase4: low,
  }
}

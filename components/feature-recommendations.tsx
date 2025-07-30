"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  recommendedFeatures,
  featureCategories,
  priorityLevels,
  getFeaturesByPriority,
  getFeaturesByCategory,
  calculateTotalEstimatedCost,
  getImplementationRoadmap,
  type RecommendedFeature,
} from "@/lib/recommended-features"
import {
  Star,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Smartphone,
  MessageSquare,
  CreditCard,
  Calendar,
  Shield,
  Navigation,
  Globe,
  Leaf,
  Brain,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"

const priorityColors = {
  Critical: "bg-red-500 text-white",
  High: "bg-orange-500 text-white",
  Medium: "bg-yellow-500 text-white",
  Low: "bg-gray-500 text-white",
}

const categoryIcons = {
  Communication: MessageSquare,
  Mobile: Smartphone,
  "AI/ML": Brain,
  Payments: CreditCard,
  Booking: Calendar,
  Innovation: Lightbulb,
  "Trust & Safety": Shield,
  Navigation: Navigation,
  Localization: Globe,
  Sustainability: Leaf,
}

export default function FeatureRecommendations() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")

  const filteredFeatures = useMemo(() => {
    let features = recommendedFeatures

    if (selectedCategory !== "all") {
      features = getFeaturesByCategory(selectedCategory)
    }

    if (selectedPriority !== "all") {
      features = features.filter((f) => f.priority === selectedPriority)
    }

    return features
  }, [selectedCategory, selectedPriority])

  const roadmap = getImplementationRoadmap()
  const totalCost = calculateTotalEstimatedCost()

  const FeatureCard = ({ feature, index }: { feature: RecommendedFeature; index: number }) => {
    const IconComponent = categoryIcons[feature.category as keyof typeof categoryIcons] || Lightbulb

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">{feature.name}</CardTitle>
                  <Badge className={`mt-1 ${priorityColors[feature.priority]}`}>{feature.priority}</Badge>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {feature.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{feature.estimatedDevelopmentTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{feature.estimatedCost}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Business Impact
                </h4>
                <p className="text-xs text-gray-600 bg-green-50 p-2 rounded">{feature.businessImpact}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  User Benefit
                </h4>
                <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded">{feature.userBenefit}</p>
              </div>
            </div>

            {feature.technicalRequirements.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Technical Requirements</h4>
                <div className="flex flex-wrap gap-1">
                  {feature.technicalRequirements.map((req, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {feature.dependencies.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Dependencies</h4>
                <div className="flex flex-wrap gap-1">
                  {feature.dependencies.map((dep, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {dep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Recommended Features for Hulet Fish Tourism
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Strategic feature recommendations to enhance user experience and drive business growth
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Lightbulb className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{recommendedFeatures.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Features</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {getFeaturesByPriority("Critical").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Critical Priority</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">${Math.round(totalCost / 1000)}K</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Est. Total Cost</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">12-18</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Months Timeline</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">All Features</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Top Priority Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getFeaturesByPriority("Critical").map((feature, index) => (
                  <div key={feature.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-gray-600">{feature.estimatedDevelopmentTime}</p>
                    </div>
                    <Badge className={priorityColors[feature.priority]}>{feature.priority}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Expected Business Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>User Engagement</span>
                      <span>+65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Booking Conversion</span>
                      <span>+45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>User Retention</span>
                      <span>+60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Revenue Growth</span>
                      <span>+80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Feature Categories Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {featureCategories.map((category) => {
                  const count = getFeaturesByCategory(category).length
                  const IconComponent = categoryIcons[category as keyof typeof categoryIcons]
                  return (
                    <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                      <IconComponent className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="font-semibold text-lg">{count}</div>
                      <div className="text-sm text-gray-600">{category}</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {featureCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    {priorityLevels.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFeatures.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <div className="space-y-8">
            {Object.entries(roadmap).map(([phase, features], phaseIndex) => (
              <Card key={phase}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        phaseIndex === 0
                          ? "bg-red-500"
                          : phaseIndex === 1
                            ? "bg-orange-500"
                            : phaseIndex === 2
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                      }`}
                    >
                      {phaseIndex + 1}
                    </div>
                    Phase {phaseIndex + 1}:{" "}
                    {phaseIndex === 0
                      ? "Critical Features (0-3 months)"
                      : phaseIndex === 1
                        ? "High Priority Features (3-6 months)"
                        : phaseIndex === 2
                          ? "Medium Priority Features (6-12 months)"
                          : "Low Priority Features (12+ months)"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature) => (
                      <div key={feature.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <h4 className="font-medium mb-2">{feature.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                        <div className="flex justify-between items-center text-xs">
                          <Badge className={priorityColors[feature.priority]}>{feature.priority}</Badge>
                          <span className="text-gray-500">{feature.estimatedDevelopmentTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost-Benefit Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getFeaturesByPriority("Critical").map((feature) => {
                    const costRange = feature.estimatedCost.replace(/[$,]/g, "").split(" - ")
                    const avgCost = (Number.parseInt(costRange[0]) + Number.parseInt(costRange[1])) / 2
                    return (
                      <div key={feature.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <h4 className="font-medium">{feature.name}</h4>
                          <p className="text-sm text-green-600">{feature.businessImpact}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${avgCost.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">avg cost</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Implementation Complexity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedFeatures.slice(0, 5).map((feature) => (
                    <div key={feature.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{feature.name}</span>
                        <span className="text-sm text-gray-500">{feature.estimatedDevelopmentTime}</span>
                      </div>
                      <div className="flex gap-2">
                        {feature.technicalRequirements.slice(0, 3).map((req, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                        {feature.technicalRequirements.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{feature.technicalRequirements.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Strategic Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Immediate Actions (Next 3 months)
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Implement real-time chat system to improve communication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Add Ethiopian payment methods (M-Birr, HelloCash)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Develop native mobile applications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Enhance review and rating system</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    Strategic Investments (6-12 months)
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>AI-powered recommendation engine for personalization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>VR experience previews for immersive marketing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Sustainability tracking for eco-conscious travelers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Ethiopian cultural calendar integration</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

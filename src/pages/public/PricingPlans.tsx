// src/components/pricing/PricingPlans.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    X,
    HelpCircle,
    Zap,
    Users,
    Building,
    Truck,
    // DollarSign,
    // Calendar,
    // Shield,
    // Leaf,
    Sparkles,
    TrendingUp,
    Award,
    Star,
    Recycle,
    ChevronRight,
    ChevronLeft,
    Globe,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

interface PricingPlan {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    monthlyPrice: number;
    annualPrice: number;
    features: {
        text: string;
        included: boolean;
        tooltip?: string;
    }[];
    highlight?: boolean;
    recommended?: boolean;
    color: string;
    icon: React.ReactNode;
    ctaText: string;
}

interface FeatureComparison {
    feature: string;
    tooltip?: string;
    plans: {
        basic: string | boolean;
        pro: string | boolean;
        business: string | boolean;
        enterprise: string | boolean;
    };
}

const PricingPlans: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
        "annual",
    );
    // const [selectedPlan, setSelectedPlan] = useState<string>("pro");
    const [activeTab, setActiveTab] = useState<
        "individual" | "business" | "driver"
    >("individual");
    const [customPickups, setCustomPickups] = useState(10);
    const [customWeight, setCustomWeight] = useState(50);
    const [showCalculator, setShowCalculator] = useState(false);

    // Individual Plans
    const individualPlans: PricingPlan[] = [
        {
            id: "basic",
            title: "Basic",
            subtitle: "For occasional waste management",
            description:
                "Perfect for individuals who need occasional pickup services",
            monthlyPrice: 29,
            annualPrice: 290,
            features: [
                { text: "1 pickup per month", included: true },
                { text: "Up to 25kg per pickup", included: true },
                { text: "Basic waste sorting", included: true },
                { text: "Email support", included: true },
                { text: "Carbon footprint report", included: true },
                { text: "Priority scheduling", included: false },
                { text: "Recycling analytics", included: false },
                { text: "Dedicated driver", included: false },
            ],
            color: "from-gray-500 to-gray-400",
            icon: <Recycle className="w-8 h-8" />,
            ctaText: "Get Started",
        },
        {
            id: "pro",
            title: "Professional",
            subtitle: "Most popular for households",
            description: "Ideal for households with regular waste management needs",
            monthlyPrice: 49,
            annualPrice: 490,
            features: [
                { text: "4 pickups per month", included: true },
                { text: "Up to 50kg per pickup", included: true },
                { text: "Advanced waste sorting", included: true },
                { text: "Priority support", included: true },
                { text: "Detailed carbon report", included: true },
                { text: "Priority scheduling", included: true },
                { text: "Basic recycling analytics", included: true },
                { text: "Dedicated driver", included: false },
            ],
            highlight: true,
            recommended: true,
            color: "from-teal-500 to-blue-500",
            icon: <Sparkles className="w-8 h-8" />,
            ctaText: "Start Free Trial",
        },
        {
            id: "premium",
            title: "Premium",
            subtitle: "Complete waste management solution",
            description: "For those who want the best waste management experience",
            monthlyPrice: 79,
            annualPrice: 790,
            features: [
                { text: "Unlimited pickups", included: true },
                { text: "Up to 100kg per pickup", included: true },
                { text: "Premium waste sorting", included: true },
                { text: "24/7 phone support", included: true },
                { text: "Advanced carbon analytics", included: true },
                { text: "Instant scheduling", included: true },
                { text: "Advanced recycling analytics", included: true },
                { text: "Dedicated driver", included: true },
            ],
            color: "from-indigo-500 to-rose-500",
            icon: <Award className="w-8 h-8" />,
            ctaText: "Go Premium",
        },
    ];

    // Business Plans
    const businessPlans: PricingPlan[] = [
        {
            id: "starter",
            title: "Starter",
            subtitle: "For small businesses",
            description: "Essential waste management for small businesses",
            monthlyPrice: 99,
            annualPrice: 990,
            features: [
                { text: "10 pickups per month", included: true },
                { text: "Up to 200kg per pickup", included: true },
                { text: "Commercial waste sorting", included: true },
                { text: "Business hours support", included: true },
                { text: "Compliance reporting", included: true },
                { text: "Basic analytics dashboard", included: false },
                { text: "API access", included: false },
                { text: "Custom waste streams", included: false },
            ],
            color: "from-blue-500 to-teal-400",
            icon: <Building className="w-8 h-8" />,
            ctaText: "Start Business Plan",
        },
        {
            id: "growth",
            title: "Growth",
            subtitle: "For growing businesses",
            description: "Scalable solution for expanding businesses",
            monthlyPrice: 199,
            annualPrice: 1990,
            features: [
                { text: "30 pickups per month", included: true },
                { text: "Up to 500kg per pickup", included: true },
                { text: "Advanced waste sorting", included: true },
                { text: "Priority business support", included: true },
                { text: "Advanced compliance", included: true },
                { text: "Analytics dashboard", included: true },
                { text: "Basic API access", included: true },
                { text: "Custom waste streams", included: false },
            ],
            highlight: true,
            recommended: true,
            color: "from-teal-500 to-blue-500",
            icon: <TrendingUp className="w-8 h-8" />,
            ctaText: "Start Free Trial",
        },
        {
            id: "enterprise",
            title: "Enterprise",
            subtitle: "Custom solution",
            description: "Tailored waste management for large organizations",
            monthlyPrice: 499,
            annualPrice: 4990,
            features: [
                { text: "Unlimited pickups", included: true },
                { text: "Custom weight limits", included: true },
                { text: "Enterprise waste sorting", included: true },
                { text: "Dedicated account manager", included: true },
                { text: "Full compliance suite", included: true },
                { text: "Enterprise analytics", included: true },
                { text: "Full API access", included: true },
                { text: "Custom waste streams", included: true },
            ],
            color: "from-indigo-500 to-rose-500",
            icon: <Globe className="w-8 h-8" />,
            ctaText: "Contact Sales",
        },
    ];

    // Driver Plans (Earnings)
    const driverPlans: PricingPlan[] = [
        {
            id: "standard",
            title: "Standard Driver",
            subtitle: "Flexible part-time earnings",
            description: "Perfect for those looking for flexible work hours",
            monthlyPrice: 1500,
            annualPrice: 18000,
            features: [
                { text: "Flexible schedule", included: true },
                { text: "Base rate per pickup", included: true },
                { text: "Basic insurance coverage", included: true },
                { text: "App support", included: true },
                { text: "Performance bonuses", included: true },
                { text: "Health benefits", included: false },
                { text: "Vehicle maintenance", included: false },
                { text: "Training program", included: true },
            ],
            color: "from-gray-500 to-gray-400",
            icon: <Truck className="w-8 h-8" />,
            ctaText: "Apply Now",
        },
        {
            id: "professional",
            title: "Professional Driver",
            subtitle: "Full-time career opportunity",
            description: "For drivers looking to build a career in waste management",
            monthlyPrice: 2500,
            annualPrice: 30000,
            features: [
                { text: "Guanteed hours", included: true },
                { text: "Premium rate per pickup", included: true },
                { text: "Full insurance coverage", included: true },
                { text: "Priority support", included: true },
                { text: "Performance bonuses", included: true },
                { text: "Health benefits", included: true },
                { text: "Vehicle maintenance", included: false },
                { text: "Advanced training", included: true },
            ],
            highlight: true,
            recommended: true,
            color: "from-teal-500 to-blue-500",
            icon: <Award className="w-8 h-8" />,
            ctaText: "Apply Now",
        },
        {
            id: "elite",
            title: "Elite Driver",
            subtitle: "Top-tier earning potential",
            description: "For experienced drivers seeking maximum earnings",
            monthlyPrice: 4000,
            annualPrice: 48000,
            features: [
                { text: "Flexible schedule", included: true },
                { text: "Elite rate per pickup", included: true },
                { text: "Premium insurance", included: true },
                { text: "24/7 dedicated support", included: true },
                { text: "Performance bonuses", included: true },
                { text: "Health + dental benefits", included: true },
                { text: "Vehicle maintenance", included: true },
                { text: "Leadership training", included: true },
            ],
            color: "from-indigo-500 to-rose-500",
            icon: <Star className="w-8 h-8" />,
            ctaText: "Join Elite Team",
        },
    ];

    // Feature Comparison Table
    const featureComparison: FeatureComparison[] = [
        {
            feature: "Monthly Pickups",
            plans: {
                basic: "1",
                pro: "4",
                business: "Unlimited",
                enterprise: "Unlimited",
            },
        },
        {
            feature: "Max Weight per Pickup",
            plans: {
                basic: "25kg",
                pro: "50kg",
                business: "100kg",
                enterprise: "Custom",
            },
        },
        {
            feature: "Waste Sorting",
            tooltip: "Automated waste categorization",
            plans: {
                basic: "Basic",
                pro: "Advanced",
                business: "Premium",
                enterprise: "Enterprise",
            },
        },
        {
            feature: "Support",
            plans: {
                basic: "Email",
                pro: "Priority",
                business: "24/7 Phone",
                enterprise: "Dedicated Manager",
            },
        },
        {
            feature: "Carbon Analytics",
            tooltip: "Detailed CO₂ savings reports",
            plans: { basic: true, pro: true, business: true, enterprise: true },
        },
        {
            feature: "Recycling Reports",
            plans: { basic: false, pro: true, business: true, enterprise: true },
        },
        {
            feature: "API Access",
            plans: {
                basic: false,
                pro: false,
                business: "Basic",
                enterprise: "Full",
            },
        },
        {
            feature: "Custom Waste Streams",
            plans: { basic: false, pro: false, business: false, enterprise: true },
        },
    ];

    const getActivePlans = () => {
        switch (activeTab) {
            case "individual":
                return individualPlans;
            case "business":
                return businessPlans;
            case "driver":
                return driverPlans;
            default:
                return individualPlans;
        }
    };

    const calculateSavings = (plan: PricingPlan) => {
        const monthlyTotal = plan.monthlyPrice * 12;
        const annualTotal = plan.annualPrice;
        return monthlyTotal - annualTotal;
    };

    const calculateCustomPrice = () => {
        const basePrice = 49;
        const pickupMultiplier = customPickups * 5;
        const weightMultiplier = customWeight * 0.5;
        return basePrice + pickupMultiplier + weightMultiplier;
    };

    const renderFeatureIcon = (included: boolean) =>
        included ? (
            <Check className="w-5 h-5 text-green-500" />
        ) : (
            <X className="w-5 h-5 text-gray-300" />
        );

    const renderPlanValue = (value: string | boolean) => {
        if (typeof value === "boolean") {
            return value ? (
                <Check className="w-5 h-5 text-green-500" />
            ) : (
                <X className="w-5 h-5 text-gray-300" />
            );
        }
        return <span className="font-medium">{value}</span>;
    };

    return (
        <div id="pricing" className="py-12">
            {/* Header */}
            <div className="text-center max-w-4xl mx-auto mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-3 mb-6"
                >
                    <Sparkles className="w-6 h-6 text-teal-500" />
                    <span className="text-sm font-bold text-teal-600 bg-teal-50 px-4 py-2 rounded-full">
                        Transparent Pricing
                    </span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Simple, Predictable{" "}
                    <span className="bg-linear-to-r from-teal-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Pricing
                    </span>
                </h1>

                <p className="text-xl text-gray-600 mb-10">
                    Choose the perfect plan for your needs. All plans include our core
                    waste management features.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="bg-linear-to-r from-gray-100 to-gray-50 p-1 rounded-2xl inline-flex">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${billingCycle === "monthly" ? "bg-white shadow-lg text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            Monthly Billing
                        </button>
                        <button
                            onClick={() => setBillingCycle("annual")}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${billingCycle === "annual" ? "bg-linear-to-r from-teal-500 to-blue-500 text-white shadow-lg" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            Annual Billing
                            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Save 20%
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Plan Type Tabs */}
            <div className="max-w-4xl mx-auto mb-15 text-center">
                <div className="bg-linear-to-r from-gray-50 to-white p-1 rounded-2xl border border-gray-200 inline-flex mx-auto">
                    {[
                        {
                            id: "individual",
                            label: "Individuals",
                            icon: <Users className="w-5 h-5" />,
                        },
                        {
                            id: "business",
                            label: "Businesses",
                            icon: <Building className="w-5 h-5" />,
                        },
                        {
                            id: "driver",
                            label: "Drivers",
                            icon: <Truck className="w-5 h-5" />,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? "bg-linear-to-r from-teal-500 to-blue-500 text-white shadow-lg" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Pricing Calculator */}
            <AnimatePresence>
                {showCalculator && activeTab === "business" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="max-w-4xl mx-auto mb-12"
                    >
                        <Card className="border-2 border-teal-200 bg-linear-to-r from-teal-50 via-white to-blue-50">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        Custom Pricing Calculator
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Calculate your exact monthly cost based on your needs
                                    </p>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                Monthly Pickups:{" "}
                                                <span className="font-bold text-teal-600 ml-2">
                                                    {customPickups}
                                                </span>
                                            </label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="100"
                                                value={customPickups}
                                                onChange={(e) =>
                                                    setCustomPickups(parseInt(e.target.value))
                                                }
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                                <span>1</span>
                                                <span>25</span>
                                                <span>50</span>
                                                <span>75</span>
                                                <span>100+</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                Average Weight (kg):{" "}
                                                <span className="font-bold text-teal-600 ml-2">
                                                    {customWeight}kg
                                                </span>
                                            </label>
                                            <input
                                                type="range"
                                                min="10"
                                                max="500"
                                                step="10"
                                                value={customWeight}
                                                onChange={(e) =>
                                                    setCustomWeight(parseInt(e.target.value))
                                                }
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                                <span>10kg</span>
                                                <span>100kg</span>
                                                <span>250kg</span>
                                                <span>500kg</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-96 text-center">
                                    <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-lg">
                                        <p className="text-sm text-gray-600 mb-2">
                                            Estimated Monthly Cost
                                        </p>
                                        <div className="text-5xl font-bold text-gray-900 mb-4">
                                            ${calculateCustomPrice().toFixed(0)}
                                            <span className="text-xl text-gray-600">/month</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Based on {customPickups} pickups at ~{customWeight}kg each
                                        </p>
                                        <Button
                                            variant="primary"
                                            className="w-full bg-linear-to-r from-teal-500 to-blue-500"
                                            onClick={() => (window.location.href = "/contact")}
                                        >
                                            Get Custom Quote
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {getActivePlans().map((plan) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: plan.id === "pro" ? 0.1 : 0 }}
                            className={`relative ${plan.highlight ? "md:-mt-4 md:mb-4" : ""}`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-linear-to-r from-teal-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            <Card
                                className={`h-full border-2 ${plan.highlight ? "border-teal-300" : "border-gray-100"} hover:shadow-2xl transition-all duration-300 overflow-hidden`}
                            >
                                <div className="relative">
                                    {plan.highlight && (
                                        <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-teal-500 via-blue-500 to-indigo-500" />
                                    )}

                                    <div className="pt-8 pb-6 px-6">
                                        {/* Plan Header */}
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div
                                                        className={`w-12 h-12 rounded-xl bg-linear-to-br ${plan.color} flex items-center justify-center`}
                                                    >
                                                        {plan.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-gray-900">
                                                            {plan.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {plan.subtitle}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 mt-3">{plan.description}</p>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="mb-8">
                                            <div className="flex items-baseline mb-2">
                                                <span className="text-4xl font-bold text-gray-900">
                                                    $
                                                    {billingCycle === "annual"
                                                        ? Math.floor(plan.annualPrice / 12)
                                                        : plan.monthlyPrice}
                                                </span>
                                                <span className="text-gray-600 ml-2">/month</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {billingCycle === "annual" ? (
                                                    <>
                                                        <span className="line-through text-gray-400">
                                                            ${plan.monthlyPrice}/month
                                                        </span>
                                                        <span className="ml-2 text-green-600 font-bold">
                                                            Save ${calculateSavings(plan)} yearly
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span>Billed monthly</span>
                                                )}
                                            </div>
                                            {activeTab === "driver" && (
                                                <p className="text-sm text-teal-600 mt-2 font-medium">
                                                    Estimated monthly earnings
                                                </p>
                                            )}
                                        </div>

                                        {/* Features */}
                                        <div className="space-y-4 mb-8">
                                            {plan.features.map((feature, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    {renderFeatureIcon(feature.included)}
                                                    <div>
                                                        <p
                                                            className={`text-sm ${feature.included ? "text-gray-900" : "text-gray-400"}`}
                                                        >
                                                            {feature.text}
                                                        </p>
                                                        {feature.tooltip && (
                                                            <div className="group relative inline-block">
                                                                <HelpCircle className="w-3 h-3 text-gray-400 ml-1" />
                                                                <div className="absolute invisible group-hover:visible w-48 bg-gray-900 text-white text-xs rounded-lg p-2 -top-10 left-1/2 transform -translate-x-1/2">
                                                                    {feature.tooltip}
                                                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* CTA Button */}
                                        <Button
                                            variant={plan.highlight ? "primary" : "outline"}
                                            className={`w-full ${plan.highlight ? "bg-linear-to-r from-teal-500 to-blue-500 hover:from-blue-500 hover:to-teal-500 text-white" : "border-teal-200 text-teal-700 hover:border-teal-500"}`}
                                            onClick={() => {
                                                if (plan.id === "enterprise") {
                                                    window.location.href = "/contact";
                                                } else {
                                                    window.location.href = "/register";
                                                }
                                            }}
                                        >
                                            {plan.ctaText}
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>

                                        {/* Additional Info */}
                                        {activeTab === "individual" && (
                                            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                                                <p className="text-xs text-gray-500">
                                                    All plans include 30-day money-back guarantee
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Custom Plan CTA */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => setShowCalculator(!showCalculator)}
                        className="text-teal-600 hover:text-teal-700 font-medium flex items-center justify-center gap-2 mx-auto"
                    >
                        {showCalculator ? "Hide Custom Calculator" : "Need a custom plan?"}
                        {showCalculator ? (
                            <ChevronLeft className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Feature Comparison Table */}
            {activeTab === "individual" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Plan Comparison
                        </h2>
                        <p className="text-gray-600">
                            Compare features across all individual plans
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
                        <div className="grid grid-cols-5 gap-0">
                            {/* Header */}
                            <div className="p-6 bg-gray-50 border-r border-gray-100">
                                <h3 className="font-bold text-gray-900">Features</h3>
                            </div>
                            {individualPlans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`p-6 text-center ${plan.highlight ? "bg-linear-to-b from-teal-50 to-white" : "bg-gray-50"}`}
                                >
                                    <div
                                        className={`inline-flex items-center gap-2 ${plan.highlight ? "text-teal-600" : "text-gray-900"}`}
                                    >
                                        {plan.icon}
                                        <span className="font-bold">{plan.title}</span>
                                    </div>
                                </div>
                            ))}

                            {/* Feature Rows */}
                            {featureComparison.map((row, rowIndex) => (
                                <React.Fragment key={rowIndex}>
                                    <div
                                        className={`p-4 border-t border-gray-100 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">
                                                {row.feature}
                                            </span>
                                            {row.tooltip && (
                                                <div className="group relative">
                                                    <HelpCircle className="w-4 h-4 text-gray-400" />
                                                    <div className="absolute invisible group-hover:visible w-48 bg-gray-900 text-white text-xs rounded-lg p-2 -top-10 left-1/2 transform -translate-x-1/2 z-10">
                                                        {row.tooltip}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {individualPlans.map((plan) => (
                                        <div
                                            key={`${rowIndex}-${plan.id}`}
                                            className={`p-4 text-center border-t border-gray-100 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"} ${plan.highlight ? "bg-linear-to-b from-teal-50/50 to-white" : ""}`}
                                        >
                                            {renderPlanValue(
                                                row.plans[plan.id as keyof typeof row.plans],
                                            )}
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600">
                        Get answers to common questions about our pricing
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            q: "Can I switch plans at any time?",
                            a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
                        },
                        {
                            q: "Is there a contract or cancellation fee?",
                            a: "No contracts and no cancellation fees. Cancel anytime from your account settings.",
                        },
                        {
                            q: "Do you offer discounts for non-profits?",
                            a: "Yes, we offer special pricing for registered non-profit organizations. Contact our sales team.",
                        },
                        {
                            q: "How does driver payment work?",
                            a: "Drivers are paid weekly via direct deposit. Earnings include base pay, bonuses, and tips.",
                        },
                        {
                            q: "What payment methods do you accept?",
                            a: "We accept all major credit cards, PayPal, and bank transfers for business accounts.",
                        },
                        {
                            q: "Is there a free trial?",
                            a: "Yes, all paid plans include a 14-day free trial. No credit card required to start.",
                        },
                    ].map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 bg-white rounded-xl border border-gray-100 hover:border-teal-300 transition-colors"
                        >
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-3">
                                <HelpCircle className="w-5 h-5 text-teal-500" />
                                {faq.q}
                            </h3>
                            <p className="text-gray-600">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Final CTA */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="bg-linear-to-br from-teal-50 via-blue-50 to-indigo-50 border-2 border-teal-200">
                    <div className="py-12 px-6 text-center">
                        <div className="w-20 h-20 mx-auto mb-8 bg-linear-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center">
                            <Zap className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Ready to Get Started?
                        </h2>

                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            Join thousands of users who trust EcoTrack for their waste
                            management needs. Start with a free trial - no credit card
                            required.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-linear-to-r from-teal-500 to-blue-500 hover:from-blue-500 hover:to-teal-500 text-white"
                                onClick={() => (window.location.href = "/register")}
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-teal-300 text-teal-700 hover:border-teal-500"
                                onClick={() => (window.location.href = "/contact")}
                            >
                                Schedule a Demo
                            </Button>
                        </div>

                        <p className="mt-8 text-gray-600">
                            Need help choosing?{" "}
                            <button className="text-teal-600 hover:text-teal-700 font-medium">
                                Talk to our sales team
                            </button>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PricingPlans;

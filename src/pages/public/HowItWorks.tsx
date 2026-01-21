// src/pages/HowItWorksPage.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Recycle,
    Calendar,
    MapPin,
    Package,
    Truck,
    Shield,
    Leaf,
    Zap,
    Users,
    CheckCircle,
    TrendingUp,
    ChevronRight,
    Sparkles,
    Play,
    SkipForward,
    SkipBack,
    Target,
    Wifi,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const HowItWorksPage: React.FC = () => {
    const [activeProcess, setActiveProcess] = useState(0);
    //   const [videoPlaying, setVideoPlaying] = useState(false);


    // Building icon component
    const Building = (props: any) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" />
            <path d="M16 6h.01" />
            <path d="M12 6h.01" />
            <path d="M12 10h.01" />
            <path d="M12 14h.01" />
            <path d="M16 10h.01" />
            <path d="M16 14h.01" />
            <path d="M8 10h.01" />
            <path d="M8 14h.01" />
        </svg>
    );

    const processes = [
        {
            step: 1,
            title: "Schedule Pickup",
            description: "Book waste collection in 60 seconds",
            icon: Calendar,
            color: "from-teal-500 to-blue-500",
            details: [
                "Select waste type (recyclable, organic, hazardous)",
                "Choose pickup date & time",
                "Specify location and quantity",
                "Get instant price quote",
            ],
        },
        {
            step: 2,
            title: "Driver Assignment",
            description: "Smart matching with certified drivers",
            icon: Truck,
            color: "from-blue-500 to-indigo-500",
            details: [
                "AI-powered driver matching",
                "Real-time driver availability",
                "Vehicle capacity optimization",
                "Route planning for efficiency",
            ],
        },
        {
            step: 3,
            title: "Real-time Tracking",
            description: "Follow your waste journey live",
            icon: MapPin,
            color: "from-indigo-500 to-rose-500",
            details: [
                "Live GPS tracking of pickup vehicle",
                "ETA updates and notifications",
                "Driver contact information",
                "Photo verification at pickup",
            ],
        },
        {
            step: 4,
            title: "Smart Processing",
            description: "Intelligent waste sorting & recycling",
            icon: Recycle,
            color: "from-rose-500 to-teal-500",
            details: [
                "Automated waste categorization",
                "Optimal recycling facility routing",
                "Environmental impact calculation",
                "Digital waste disposal certificates",
            ],
        },
    ];

    const userTypes = [
        {
            type: "Residential Users",
            icon: Users,
            description: "Easy household waste management",
            features: [
                "Weekly/monthly subscriptions",
                "Flexible scheduling",
                "Eco-points rewards",
                "Carbon footprint tracking",
            ],
            color: "from-teal-500 to-blue-400",
        },
        {
            type: "Commercial Clients",
            icon: Building,
            description: "Business waste solutions",
            features: [
                "Custom waste management plans",
                "Bulk pickup discounts",
                "Compliance reporting",
                "Waste analytics dashboard",
            ],
            color: "from-blue-500 to-indigo-400",
        },
        {
            type: "Partner Drivers",
            icon: Truck,
            description: "Earn with flexible schedules",
            features: [
                "Real-time pickup requests",
                "Optimized route planning",
                "Performance incentives",
                "Safety training & support",
            ],
            color: "from-indigo-500 to-rose-400",
        },
    ];

    const techStack = [
        {
            name: "Smart IoT Sensors",
            icon: Wifi,
            description: "Real-time waste level monitoring",
            benefit: "Predictive collection scheduling",
        },
        {
            name: "AI Sorting",
            icon: Target,
            description: "Computer vision waste identification",
            benefit: "95% sorting accuracy",
        },
        {
            name: "Route Optimization",
            icon: MapPin,
            description: "Dynamic route planning algorithm",
            benefit: "30% fuel savings",
        },
        {
            name: "Blockchain Tracking",
            icon: Shield,
            description: "Immutable waste journey records",
            benefit: "Complete transparency",
        },
    ];

    const benefits = [
        {
            title: "Environmental Impact",
            value: "500K+ tons diverted",
            icon: Leaf,
            description: "From landfills annually",
            color: "text-green-600",
        },
        {
            title: "Carbon Savings",
            value: "250K+ tons CO₂",
            icon: TrendingUp,
            description: "Reduced emissions",
            color: "text-teal-600",
        },
        {
            title: "Active Users",
            value: "50K+",
            icon: Users,
            description: "Across 50+ cities",
            color: "text-blue-600",
        },
        {
            title: "Driver Partners",
            value: "2K+",
            icon: Truck,
            description: "Creating green jobs",
            color: "text-indigo-600",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };


    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-blue-50/20">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-teal-500/10 via-blue-500/5 to-indigo-500/10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-300/10 rounded-full -translate-y-48 translate-x-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/10 rounded-full translate-y-48 -translate-x-48" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Transforming Waste Management
                            <br />
                            <span className="bg-linear-to-r from-teal-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Through Technology
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                            EcoTrack combines smart technology, environmental science, and
                            community engagement to create a circular economy for waste
                            management.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-linear-to-r from-teal-500 to-blue-500 hover:from-blue-500 hover:to-teal-500 text-white"
                                onClick={() =>
                                    document
                                        .getElementById("process")
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                            >
                                <Play className="w-5 h-5 mr-2" />
                                See How It Works
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-teal-300 text-teal-700 hover:border-teal-500"
                                onClick={() => (window.location.href = "/register")}
                            >
                                Get Started Free
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Impact Stats */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-20"
            >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            //   variants={itemVariants}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-3 rounded-xl bg-linear-to-br ${benefit.color.replace("text-", "from-")} ${benefit.color.replace("text-", "to-")} bg-opacity-10`}
                                >
                                    <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {benefit.value}
                                    </div>
                                    <div className="text-sm text-gray-600">{benefit.title}</div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Process Flow */}
            <div
                id="process"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        The EcoTrack Process
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        From scheduling to recycling, our platform makes waste management
                        simple, efficient, and environmentally responsible.
                    </p>
                </motion.div>

                {/* Process Steps */}
                <div className="relative">
                    {/* Process Line */}
                    <div className="absolute left-0 right-0 top-24 h-0.5 bg-linear-to-r from-teal-500 via-blue-500 to-indigo-500 hidden lg:block" />

                    {/* Process Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                        {processes.map((process, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                                onMouseEnter={() => setActiveProcess(index)}
                            >
                                {/* Step Number */}
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white border-4 border-white rounded-full shadow-lg">
                                    <div
                                        className={`w-full h-full rounded-full bg-linear-to-br ${process.color} flex items-center justify-center`}
                                    >
                                        <span className="text-white font-bold text-lg">
                                            {process.step}
                                        </span>
                                    </div>
                                </div>

                                {/* Card */}
                                <Card
                                    className={`pt-12 pb-6 text-center transition-all duration-300 ${activeProcess === index
                                            ? "border-2 border-teal-300 shadow-2xl transform scale-105"
                                            : "border border-gray-100"
                                        }`}
                                >
                                    <div
                                        className={`w-16 h-16 mx-auto mb-6 bg-linear-to-br ${process.color} rounded-2xl flex items-center justify-center`}
                                    >
                                        <process.icon className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {process.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6">{process.description}</p>

                                    <ul className="text-left space-y-2">
                                        {process.details.map((detail, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-center text-sm text-gray-700"
                                            >
                                                <CheckCircle className="w-4 h-4 text-teal-500 mr-2 shrink-0" />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Process Controls */}
                    <div className="flex justify-center items-center gap-4 mt-12">
                        <button
                            onClick={() => setActiveProcess((prev) => Math.max(0, prev - 1))}
                            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                            <SkipBack className="w-5 h-5" />
                        </button>

                        <div className="flex gap-2">
                            {processes.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveProcess(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${activeProcess === index
                                            ? "bg-linear-to-r from-teal-500 to-blue-500 w-8"
                                            : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() =>
                                setActiveProcess((prev) =>
                                    Math.min(processes.length - 1, prev + 1),
                                )
                            }
                            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                            <SkipForward className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Technology Stack */}
            <div className="bg-linear-to-b from-white to-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-3 mb-4">
                            <Zap className="w-6 h-6 text-teal-500" />
                            <span className="text-sm font-bold text-teal-600 bg-teal-50 px-4 py-2 rounded-full">
                                Powered By Innovation
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Smart Technology Backbone
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We leverage cutting-edge technologies to optimize every aspect of
                            waste management.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {techStack.map((tech, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group"
                            >
                                <Card className="h-full border border-gray-100 hover:border-teal-300 transition-all duration-300">
                                    <div className="p-4 bg-linear-to-br from-teal-50 to-blue-50 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <tech.icon className="w-8 h-8 text-teal-600" />
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {tech.name}
                                    </h3>
                                    <p className="text-gray-600 mb-4">{tech.description}</p>

                                    <div className="flex items-center gap-2 text-sm font-medium text-teal-700">
                                        <Sparkles className="w-4 h-4" />
                                        <span>{tech.benefit}</span>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Types */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Built for Everyone
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Whether you're a homeowner, business, or driver, EcoTrack has
                            solutions tailored for you.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {userTypes.map((user, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="relative"
                            >
                                <Card className="h-full border-2 border-gray-100 hover:border-teal-300 transition-all duration-300 overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-teal-500 via-blue-500 to-indigo-500" />

                                    <div className="pt-8 pb-6 px-6">
                                        <div
                                            className={`w-16 h-16 mx-auto mb-6 bg-linear-to-br ${user.color} rounded-2xl flex items-center justify-center`}
                                        >
                                            <user.icon className="w-8 h-8 text-white" />
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                                            {user.type}
                                        </h3>
                                        <p className="text-gray-600 text-center mb-8">
                                            {user.description}
                                        </p>

                                        <ul className="space-y-3">
                                            {user.features.map((feature, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-center text-gray-700"
                                                >
                                                    <div
                                                        className={`w-2 h-2 rounded-full bg-linear-to-br ${user.color} mr-3`}
                                                    />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            variant="outline"
                                            className="w-full mt-8 border-teal-200 text-teal-700 hover:border-teal-500"
                                            onClick={() => (window.location.href = "/register")}
                                        >
                                            Learn More
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-linear-to-br from-teal-50 via-blue-50 to-indigo-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-3 mb-6">
                                <Leaf className="w-6 h-6 text-teal-600" />
                                <span className="text-sm font-bold text-teal-600 bg-teal-100 px-4 py-2 rounded-full">
                                    Environmental Impact
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Building a Sustainable Future Together
                            </h2>

                            <p className="text-lg text-gray-600 mb-8">
                                Every pickup contributes to our mission of creating a circular
                                economy. We're not just collecting waste - we're transforming it
                                into valuable resources while protecting our planet.
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="bg-white rounded-xl p-4 border border-gray-100">
                                    <div className="text-2xl font-bold text-teal-600 mb-2">
                                        95%
                                    </div>
                                    <div className="text-sm text-gray-600">Recycling Rate</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-100">
                                    <div className="text-2xl font-bold text-blue-600 mb-2">
                                        60%
                                    </div>
                                    <div className="text-sm text-gray-600">Carbon Reduction</div>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="bg-linear-to-r from-teal-500 to-blue-500 hover:from-blue-500 hover:to-teal-500 text-white"
                                onClick={() => (window.location.href = "/impact")}
                            >
                                View Our Impact Report
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                    The Circular Economy
                                </h3>

                                <div className="space-y-6">
                                    {[
                                        {
                                            step: "Collection",
                                            desc: "Smart pickup from homes & businesses",
                                            icon: Truck,
                                        },
                                        {
                                            step: "Sorting",
                                            desc: "AI-powered waste categorization",
                                            icon: Target,
                                        },
                                        {
                                            step: "Processing",
                                            desc: "Transformation into raw materials",
                                            icon: Recycle,
                                        },
                                        {
                                            step: "Recycling",
                                            desc: "Manufacturing new products",
                                            icon: Package,
                                        },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-linear-to-br from-teal-100 to-blue-100 rounded-xl flex items-center justify-center">
                                                <item.icon className="w-6 h-6 text-teal-600" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">
                                                    {item.step}
                                                </div>
                                                <div className="text-sm text-gray-600">{item.desc}</div>
                                            </div>
                                            {index < 3 && (
                                                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <Card className="max-w-4xl mx-auto bg-linear-to-br from-teal-50 via-blue-50 to-indigo-50 border-2 border-teal-100">
                            <div className="py-12 px-6">
                                <div className="w-20 h-20 mx-auto mb-8 bg-linear-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center">
                                    <Recycle className="w-10 h-10 text-white" />
                                </div>

                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                    Ready to Make a Difference?
                                </h2>

                                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                                    Join thousands of users, businesses, and drivers who are
                                    transforming waste management into a force for good.
                                </p>

                                <div className="flex flex-wrap justify-center gap-4">
                                    <Button
                                        size="lg"
                                        className="bg-linear-to-r from-teal-500 to-blue-500 hover:from-blue-500 hover:to-teal-500 text-white"
                                        onClick={() => (window.location.href = "/register")}
                                    >
                                        Get Started Free
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-teal-300 text-teal-700 hover:border-teal-500"
                                        onClick={() => (window.location.href = "/schedule-pickup")}
                                    >
                                        Schedule a Pickup
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-blue-300 text-blue-700 hover:border-blue-500"
                                        onClick={() => (window.location.href = "/driver/apply")}
                                    >
                                        Become a Driver
                                    </Button>
                                </div>

                                <div className="mt-10 pt-8 border-t border-gray-200">
                                    <p className="text-gray-600 mb-4">
                                        Have questions about how it works?
                                    </p>
                                    <Button
                                        // variant="ghost"
                                        className="text-teal-600 hover:text-teal-700"
                                        onClick={() => (window.location.href = "/contact")}
                                    >
                                        Contact Our Team
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksPage;

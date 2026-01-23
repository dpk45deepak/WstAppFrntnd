import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    HelpCircle,
    Search,
    BookOpen,
    Phone,
    Mail,
    MessageSquare,
    FileText,
    Shield,
    DollarSign,
    Package,
    Users,
    Settings,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Star,
    ThumbsUp,
    ThumbsDown,
    CheckCircle,
    AlertCircle,
    Clock,
    Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import Input from "../../components/common/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { Badge } from "../../components/ui/Badge";

const HelpCenterPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const helpCategories = [
        {
            icon: <Package className="w-6 h-6" />,
            title: "Getting Started",
            description: "Learn how to start driving",
            color: "bg-blue-100 text-blue-600",
            count: 5,
        },
        {
            icon: <DollarSign className="w-6 h-6" />,
            title: "Earnings & Payments",
            description: "Understand your earnings",
            color: "bg-green-100 text-green-600",
            count: 8,
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Safety & Guidelines",
            description: "Stay safe on the road",
            color: "bg-red-100 text-red-600",
            count: 6,
        },
        {
            icon: <Settings className="w-6 h-6" />,
            title: "App & Technical",
            description: "App issues and features",
            color: "bg-purple-100 text-purple-600",
            count: 7,
        },
    ];

    const faqs = [
        {
            question: "How do I receive payments?",
            answer:
                "Payments are automatically deposited to your registered bank account every Tuesday. You can also track your earnings in real-time through the Earnings section of the app.",
            category: "earnings",
        },
        {
            question: "What safety features are available?",
            answer:
                "We provide emergency assistance, trip sharing with trusted contacts, and 24/7 support. All rides are GPS-tracked and recorded for your safety.",
            category: "safety",
        },
        {
            question: "How do I update my vehicle information?",
            answer:
                "Go to Settings > Vehicle Information to update your vehicle details. You'll need to provide registration and insurance documents for verification.",
            category: "technical",
        },
        {
            question: "What are the rating requirements?",
            answer:
                "Maintain a minimum 4.5-star rating to continue driving. Ratings below 4.0 may result in temporary deactivation while we provide additional training.",
            category: "guidelines",
        },
        {
            question: "How do I contact support?",
            answer:
                "You can contact support through the Help Center, call our 24/7 support line at 1-800-DRIVER, or use the in-app chat feature for quick assistance.",
            category: "support",
        },
    ];

    const popularArticles = [
        { title: "Maximizing Your Earnings", reads: "1.2k", helpful: "95%" },
        { title: "Safety Best Practices", reads: "2.4k", helpful: "98%" },
        { title: "Tax Guide for Drivers", reads: "856", helpful: "92%" },
        { title: "App Troubleshooting", reads: "1.5k", helpful: "89%" },
    ];

    const supportChannels = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: "Phone Support",
            description: "24/7 emergency support line",
            contact: "1-800-DRIVER",
            response: "Immediate",
            color: "bg-green-100 text-green-600",
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "Live Chat",
            description: "Chat with our support team",
            contact: "Available 24/7",
            response: "Within 5 minutes",
            color: "bg-blue-100 text-blue-600",
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email Support",
            description: "Send us detailed inquiries",
            contact: "support@rideapp.com",
            response: "Within 24 hours",
            color: "bg-purple-100 text-purple-600",
        },
    ];

    const handleSubmitContact = (e: any) => {
        e.preventDefault();
        alert("Thank you for your message! We'll get back to you soon.");
        setContactForm({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4 md:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center justify-center p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl mb-6"
                    >
                        <HelpCircle className="w-12 h-12 text-blue-600" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        How can we help you today?
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                        Find answers to common questions, browse articles, or get in touch
                        with our support team
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search for answers..."
                                value={searchQuery}
                                onChange={(e: any) => setSearchQuery(e.target.value)}
                                className="pl-12 py-6 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                            <Badge
                                variant="secondary"
                                className="cursor-pointer hover:bg-gray-200"
                            >
                                Earnings
                            </Badge>
                            <Badge
                                variant="secondary"
                                className="cursor-pointer hover:bg-gray-200"
                            >
                                Safety
                            </Badge>
                            <Badge
                                variant="secondary"
                                className="cursor-pointer hover:bg-gray-200"
                            >
                                Payments
                            </Badge>
                            <Badge
                                variant="secondary"
                                className="cursor-pointer hover:bg-gray-200"
                            >
                                Account
                            </Badge>
                            <Badge
                                variant="secondary"
                                className="cursor-pointer hover:bg-gray-200"
                            >
                                App Issues
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {helpCategories.map((category, index) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="cursor-pointer"
                        >
                            <Card className="border border-gray-200 hover:border-blue-200 transition-all h-full">
                                <CardContent className="p-6">
                                    <div
                                        className={`p-3 rounded-xl w-fit mb-4 ${category.color}`}
                                    >
                                        {category.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {category.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">{category.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            {category.count} articles
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <Tabs defaultValue="faq" className="mb-12">
                    <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="faq">FAQs</TabsTrigger>
                        <TabsTrigger value="articles">Popular Articles</TabsTrigger>
                        <TabsTrigger value="contact">Contact Support</TabsTrigger>
                    </TabsList>

                    {/* FAQs */}
                    <TabsContent value="faq" className="mt-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {faqs.map((faq, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border border-gray-200 rounded-xl overflow-hidden"
                                        >
                                            <button
                                                onClick={() => {
                                                    if (expandedFaq === index) {
                                                        setExpandedFaq(null);
                                                    } else {
                                                        setExpandedFaq(index as any);
                                                    }
                                                }
                                                }
                                                className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg">
                                                        <HelpCircle className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <span className="font-semibold text-gray-900">
                                                        {faq.question}
                                                    </span>
                                                </div>
                                                {expandedFaq === index ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                                )}
                                            </button>
                                            <AnimatePresence>
                                                {expandedFaq === index && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-5 pb-5">
                                                            <p className="text-gray-700">{faq.answer}</p>
                                                            <div className="flex items-center gap-4 mt-4">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-green-600"
                                                                >
                                                                    <ThumbsUp className="w-4 h-4 mr-2" />
                                                                    Helpful
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-red-600"
                                                                >
                                                                    <ThumbsDown className="w-4 h-4 mr-2" />
                                                                    Not helpful
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Popular Articles */}
                    <TabsContent value="articles" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Most Read Articles
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {popularArticles.map((article) => (
                                            <div
                                                key={article.title}
                                                className="p-4 border border-gray-200 rounded-xl hover:border-blue-200 transition-colors"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {article.title}
                                                    </h4>
                                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {article.reads} reads
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                        {article.helpful} helpful
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Resources</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                title: "Driver Handbook",
                                                icon: <FileText className="w-5 h-5" />,
                                            },
                                            {
                                                title: "Safety Guidelines",
                                                icon: <Shield className="w-5 h-5" />,
                                            },
                                            {
                                                title: "Community Forum",
                                                icon: <Users className="w-5 h-5" />,
                                            },
                                            {
                                                title: "Legal Documents",
                                                icon: <Globe className="w-5 h-5" />,
                                            },
                                        ].map((resource) => (
                                            <Button
                                                key={resource.title}
                                                variant="outline"
                                                className="w-full justify-start h-auto py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gray-100 rounded-lg">
                                                        {resource.icon}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-medium">{resource.title}</p>
                                                        <p className="text-sm text-gray-600">
                                                            PDF • Updated recently
                                                        </p>
                                                    </div>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Contact Support */}
                    <TabsContent value="contact" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Support Channels */}
                            <div className="lg:col-span-1 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Support Channels
                                </h3>
                                {supportChannels.map((channel, index) => (
                                    <motion.div
                                        key={channel.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Card className="border border-gray-200">
                                            <CardContent className="p-5">
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-xl ${channel.color}`}>
                                                        {channel.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900">
                                                            {channel.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {channel.description}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <p className="font-medium text-gray-900">
                                                                {channel.contact}
                                                            </p>
                                                            <Badge variant="outline" className="text-xs">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                {channel.response}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Send us a message</CardTitle>
                                        <p className="text-gray-600 text-sm">
                                            Fill out the form below and our team will get back to you
                                            as soon as possible
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmitContact} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Your Name
                                                    </label>
                                                    <Input
                                                        value={contactForm.name}
                                                        onChange={(e: any) =>
                                                            setContactForm({
                                                                ...contactForm,
                                                                name: e.target.value,
                                                            })
                                                        }
                                                        placeholder="John Doe"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Email Address
                                                    </label>
                                                    <Input
                                                        type="email"
                                                        value={contactForm.email}
                                                        onChange={(e: any) =>
                                                            setContactForm({
                                                                ...contactForm,
                                                                email: e.target.value,
                                                            })
                                                        }
                                                        placeholder="john@example.com"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Subject
                                                </label>
                                                <Input
                                                    value={contactForm.subject}
                                                    onChange={(e: any) =>
                                                        setContactForm({
                                                            ...contactForm,
                                                            subject: e.target.value,
                                                        })
                                                    }
                                                    placeholder="What can we help you with?"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Message
                                                </label>
                                                <Textarea
                                                    value={contactForm.message}
                                                    onChange={(e: any) =>
                                                        setContactForm({
                                                            ...contactForm,
                                                            message: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Please describe your issue in detail..."
                                                    rows={6}
                                                    required
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                            >
                                                <Mail className="w-4 h-4 mr-2" />
                                                Send Message
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                {/* Status Alerts */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div className="p-4 bg-linear-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-green-800">
                                                    System Status
                                                </h4>
                                                <p className="text-sm text-green-700">
                                                    All systems operational
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-linear-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-amber-800">
                                                    Response Time
                                                </h4>
                                                <p className="text-sm text-amber-700">
                                                    Average: 2.4 hours
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
};

export default HelpCenterPage;

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight,
  Truck,
  Shield,
  Zap,
  Star,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setEmail("");
        alert("Thanks! We'll notify you when we launch.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <SiteHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Navigation Tabs */}
          {/* <div className="flex justify-center mb-8">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border">
              <Badge variant="default" className="px-4 py-2 bg-blue-600 text-white">
                Looking For Drivers
              </Badge>
              <Badge variant="ghost" className="px-4 py-2 text-gray-500">
                CDL Driver Gigs
              </Badge>
              <Badge variant="ghost" className="px-4 py-2 text-gray-500">
                DriverGigsPro
              </Badge>
              <Badge variant="ghost" className="px-4 py-2 text-gray-500">
                GigsProAI
              </Badge>
            </div>
          </div> */}

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Connect with{" "}
            <span className="text-blue-600">qualified drivers</span>{" "}
            instantly
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Search our database of drivers both CDL and non-CDL. Access our
            network of pre-screened drivers ready for delivery, logistics, and
            transportation opportunities.
          </p>

          {/* Email Signup */}
          <div className="bg-white rounded-lg p-6 shadow-lg border max-w-2xl mx-auto">
            <p className="text-gray-700 mb-4 font-medium">
              Looking for Drivers is coming soon! Get notified when we launch:
            </p>
            <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                {isSubmitting ? "Submitting..." : "Notify Me"}
              </Button>
              <Button variant="outline" className="px-8">
                Learn More
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Card className="text-center p-6 bg-white shadow-lg border-0">
            <CardContent className="p-0">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Active Drivers</div>
            </CardContent>
          </Card>

          <Card className="text-center p-6 bg-white shadow-lg border-0">
            <CardContent className="p-0">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">50</div>
              <div className="text-gray-600 font-medium">States Covered</div>
            </CardContent>
          </Card>

          <Card className="text-center p-6 bg-white shadow-lg border-0">
            <CardContent className="p-0">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">24HR</div>
              <div className="text-gray-600 font-medium">Response Time</div>
            </CardContent>
          </Card>

          <Card className="text-center p-6 bg-white shadow-lg border-0">
            <CardContent className="p-0">
              <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">99%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How do we connect you with drivers?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Search */}
          <Card className="p-8 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-0 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">SEARCH</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse our comprehensive database of 10K+ qualified drivers. Filter by location,
                license type (CDL/non-CDL), and experience level to find perfect matches.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="text-xs">Location Filter</Badge>
                <Badge variant="secondary" className="text-xs">CDL/Non-CDL</Badge>
                <Badge variant="secondary" className="text-xs">Experience Level</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Connect */}
          <Card className="p-8 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-0 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">CONNECT</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect directly with pre-screened drivers ready for delivery, logistics,
                and transportation roles. Fast, reliable recruitment solutions.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="text-xs">Pre-screened</Badge>
                <Badge variant="secondary" className="text-xs">Direct Contact</Badge>
                <Badge variant="secondary" className="text-xs">Fast Response</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Scale */}
          <Card className="p-8 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-0 text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">SCALE</h3>
              <p className="text-gray-600 leading-relaxed">
                Expand your delivery operations quickly with access to qualified drivers
                nationwide. 24-hour response time with 99% success rate.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="text-xs">Nationwide</Badge>
                <Badge variant="secondary" className="text-xs">24hr Response</Badge>
                <Badge variant="secondary" className="text-xs">99% Success</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DriverGigsPro?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The most comprehensive platform for connecting with qualified drivers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pre-Screened Drivers</h3>
                <p className="text-gray-600 text-sm">All drivers undergo thorough background checks and verification</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Nationwide Coverage</h3>
                <p className="text-gray-600 text-sm">Access drivers across all 50 states for maximum flexibility</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Fast Response</h3>
                <p className="text-gray-600 text-sm">Get connected with qualified drivers within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">CDL & Non-CDL</h3>
                <p className="text-gray-600 text-sm">Both commercial and non-commercial drivers available</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Verified Experience</h3>
                <p className="text-gray-600 text-sm">All driver experience and credentials are verified</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Easy Integration</h3>
                <p className="text-gray-600 text-sm">Seamlessly integrate with your existing operations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your gig work success journey
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 bg-white shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    $0<span className="text-lg font-normal text-gray-500">/forever</span>
                  </div>
                  <p className="text-gray-600">Get started with basic gig work tools</p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Access to TEN Driver Opportunities</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Complete Fleet Management System</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Advanced Job Tracking & Analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Business Formation Tools & Guides</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Document Management & Storage</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Priority Feature Requests</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">No Monthly Fees - Get Lifetime Access Now</span>
                  </li>
                </ul>

                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Plan */}
            <Card className="p-8 bg-white shadow-lg border-2 border-blue-500 hover:shadow-xl transition-shadow relative">
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly Plan</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    $15<span className="text-lg font-normal text-gray-500">/per month</span>
                  </div>
                  <p className="text-gray-600">Everything you need for growing gig work success</p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Everything forever - no monthly fees</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Access to 50 Driver Opportunities</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Complete Fleet Management System</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Advanced Job Tracking & Analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Driver Gigs Academy & Training Courses</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Business Formation Tools & Guides</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Document Management & Storage</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Expense Tracking & Tax Optimization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Calendar Integration & Scheduling</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Affiliate Program & Referral System</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Money For You AI Savings Recommendations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Priority Feature Requests</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Exclusive Community Access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">No Monthly Fees - Pay Once, Own Forever</span>
                  </li>
                </ul>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Start Monthly Plan
                </Button>
              </CardContent>
            </Card>

            {/* Lifetime Plan */}
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg border-2 border-purple-500 hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Best Value - Limited Time
                </Badge>
              </div>

              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Lifetime Access</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    $497<span className="text-lg font-normal text-gray-500">/one time</span>
                  </div>
                  <p className="text-gray-600">Everything forever - no monthly fees</p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Everything forever - no monthly fees</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Access to HUNDREDS of Driver Opportunities</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Complete Fleet Management System</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Advanced Job Tracking & Analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Driver Gigs Academy & Training Courses</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Business Formation Tools & Guides</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Document Management & Storage</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Expense Tracking & Tax Optimization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Calendar Integration & Scheduling</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Personal Coaching & Success Consultations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Affiliate Program & Referral System</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Money For You AI Savings Recommendations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Priority Feature Requests</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Exclusive Community Access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">No Monthly Fees - Pay Once, Own Forever</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Driver Gig Academy - full access</span>
                  </li>
                </ul>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  Get Lifetime Access Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "Can I change plans anytime?",
                answer: "Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately."
              },
              {
                question: "Is there a free trial?",
                answer: "Our Free plan is available forever! Try Pro features with a 14-day free trial, no credit card required."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes! We offer a 30-day money-back guarantee for all paid plans, no questions asked."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-white shadow-sm border">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      {/* <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to boost your gig work income?
            </h2>
            <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of drivers already using our platform
            </p>
            <Button size="lg" variant="secondary" className="px-8">
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Connect with Qualified Drivers?
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of companies who trust DriverGigsPro for their driver recruitment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="px-8 text-black border-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DriverGigsPro</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting companies with qualified drivers nationwide.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Driver Search</li>
                <li>CDL Drivers</li>
                <li>Non-CDL Drivers</li>
                <li>Logistics Support</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>support@drivergigspro.com</li>
                <li>1-800-DRIVERS</li>
                <li>24/7 Support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 DriverGigsPro. All rights reserved.</p>
          </div>
          <p className="attribution">
            <a href="https://logo.dev">Logos provided by Logo.dev</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
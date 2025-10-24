"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Shield,
  Zap
} from "lucide-react";

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Select the perfect plan for your gig work success journey
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Free Plan */}
        <Card className="p-6 bg-white shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow">
          <CardContent className="p-0">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free Plan</h3>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                $0<span className="text-base font-normal text-gray-500">/forever</span>
              </div>
              <p className="text-gray-600 text-sm">Get started with basic gig work tools</p>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Access to TEN Driver Opportunities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Complete Fleet Management System</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Advanced Job Tracking & Analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Business Formation Tools & Guides</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Document Management & Storage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Priority Feature Requests</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">No Monthly Fees - Get Lifetime Access Now</span>
              </li>
            </ul>
            
            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* Monthly Plan */}
        <Card className="p-6 bg-white shadow-lg border-2 border-blue-500 hover:shadow-xl transition-shadow relative">
          <CardContent className="p-0">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly Plan</h3>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                $15<span className="text-base font-normal text-gray-500">/per month</span>
              </div>
              <p className="text-gray-600 text-sm">Everything you need for growing gig work success</p>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Everything forever - no monthly fees</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Access to 50 Driver Opportunities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Complete Fleet Management System</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Advanced Job Tracking & Analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Driver Gigs Academy & Training Courses</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Business Formation Tools & Guides</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Document Management & Storage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Expense Tracking & Tax Optimization</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Calendar Integration & Scheduling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Affiliate Program & Referral System</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Money For You AI Savings Recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Priority Feature Requests</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Exclusive Community Access</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">No Monthly Fees - Pay Once, Own Forever</span>
              </li>
            </ul>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Upgrade to Monthly
            </Button>
          </CardContent>
        </Card>

        {/* Lifetime Plan */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg border-2 border-purple-500 hover:shadow-xl transition-shadow relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 flex items-center gap-1 text-xs">
              <Sparkles className="w-3 h-3" />
              Best Value - Limited Time
            </Badge>
          </div>
          
          <CardContent className="p-0">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lifetime Access</h3>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                $497<span className="text-base font-normal text-gray-500">/one time</span>
              </div>
              <p className="text-gray-600 text-sm">Everything forever - no monthly fees</p>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Everything forever - no monthly fees</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Access to HUNDREDS of Driver Opportunities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Complete Fleet Management System</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Advanced Job Tracking & Analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Driver Gigs Academy & Training Courses</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Business Formation Tools & Guides</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Document Management & Storage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Expense Tracking & Tax Optimization</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Calendar Integration & Scheduling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Personal Coaching & Success Consultations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Affiliate Program & Referral System</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Money For You AI Savings Recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Priority Feature Requests</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Exclusive Community Access</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">No Monthly Fees - Pay Once, Own Forever</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Driver Gig Academy - full access</span>
              </li>
            </ul>
            
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              Get Lifetime Access Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Comparison */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Why Upgrade Your Plan?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">More Opportunities</h3>
              <p className="text-gray-600 text-sm">Access hundreds of driver opportunities with premium plans</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Advanced Features</h3>
              <p className="text-gray-600 text-sm">Get access to AI recommendations and personal coaching</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">No Monthly Fees</h3>
              <p className="text-gray-600 text-sm">Pay once and own your plan forever with lifetime access</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Frequently Asked Questions
        </h2>

        <div className="max-w-2xl mx-auto space-y-3">
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
            <Card key={index} className="bg-gray-50 shadow-sm border-0">
              <CardContent className="p-0">
                <button
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors rounded-lg"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <h3 className="font-medium text-gray-900 text-sm">{faq.question}</h3>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-center text-white">
        <h2 className="text-xl font-bold mb-2">
          Ready to boost your gig work income?
        </h2>
        <p className="text-sm mb-4 opacity-90">
          Join thousands of drivers already using our platform
        </p>
        <Button size="sm" variant="secondary" className="px-6">
          Start Your Free Trial
        </Button>
      </div>
    </div>
  );
}

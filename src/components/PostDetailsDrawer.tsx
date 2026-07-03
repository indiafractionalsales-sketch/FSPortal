"use client";

import { X, MapPin, Briefcase, Globe, Target, CheckSquare, DollarSign, Package, Info, Calendar, Clock, ExternalLink, FileText } from "lucide-react";

interface PostDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
}

const DetailItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: any }) => {
  if (value === undefined || value === null || value === "" || value === false) return null;
  return (
    <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl">
      <div className="p-2 bg-gray-50 text-[#701010] rounded-lg flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm text-gray-900 font-sans font-medium">
          {typeof value === 'boolean' ? "Yes" : value}
        </p>
      </div>
    </div>
  );
};

const SectionHeading = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2 mt-8 first:mt-0">
    <Icon className="w-5 h-5 text-[#701010]" />
    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-headline">{title}</h3>
  </div>
);

export default function PostDetailsDrawer({ isOpen, onClose, post }: PostDetailsDrawerProps) {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl h-full bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col transform transition-transform duration-300 border-l border-white/20">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/50 bg-white/50">
          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900">
              {post.postType === "obo" ? "Business Owner Opportunity" : "Sales Partner Event"}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-gray-500 font-headline uppercase tracking-wider">Posted by {post.authorName || "User"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100/50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-gray-50/30">
          
          {post.mediaUrl && (
            <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 mb-6">
              <img src={post.mediaUrl} alt="Post Media" className="w-full h-full object-cover" />
            </div>
          )}

          {post.postType === "obo" ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              {/* OBO Specific Details */}
              {post.expectedOutcomes && (
                <div className="mb-8 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-[#701010]" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-headline">Partnership Goals & Outcomes</h3>
                  </div>
                  <p className="text-sm text-gray-700 font-sans whitespace-pre-wrap">{post.expectedOutcomes}</p>
                </div>
              )}

              <SectionHeading icon={Globe} title="Target Market Requirements" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailItem icon={MapPin} label="Target Country" value={post.targetCountry} />
                <DetailItem icon={MapPin} label="Target City" value={post.targetCity} />
                <DetailItem icon={Target} label="Customer Type" value={post.targetCustomerType} />
                <DetailItem icon={Briefcase} label="Industry Vertical" value={post.targetIndustry} />
                <DetailItem icon={Globe} label="B2B Channels Needed" value={post.b2bChannels} />
                <DetailItem icon={Globe} label="B2C Channels Needed" value={post.b2cChannels} />
              </div>

              <SectionHeading icon={Target} title="Sales Rep Profile Required" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailItem icon={FileText} label="Language Required" value={post.languageRequired} />
                <DetailItem icon={Globe} label="Cultural Familiarity" value={post.culturalFamiliarity} />
                <DetailItem icon={MapPin} label="Rep Location" value={post.repLocation} />
                <DetailItem icon={Briefcase} label="Min Experience" value={post.minExperience} />
                <DetailItem icon={Briefcase} label="Industry Experience" value={post.industryExperience} />
                <DetailItem icon={CheckSquare} label="B2B Sales Exp Required" value={post.b2bSalesExperience} />
                <DetailItem icon={CheckSquare} label="B2C Sales Exp Required" value={post.b2cSalesExperience} />
                <DetailItem icon={CheckSquare} label="Existing Network Req" value={post.existingNetwork} />
                <DetailItem icon={CheckSquare} label="Travel Willingness Req" value={post.travelWillingness} />
              </div>

              <SectionHeading icon={Briefcase} title="Scope of Representation" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailItem icon={FileText} label="Representation Type" value={post.representationType} />
                <DetailItem icon={Globe} label="Countries to Cover" value={post.countriesToCover} />
                <DetailItem icon={FileText} label="Exclusivity" value={post.exclusiveNonExclusive} />
                <DetailItem icon={Calendar} label="Specific Expo" value={post.specificExpo} />
                <DetailItem icon={CheckSquare} label="Competing Brands Restriction" value={post.competingBrandsRestriction} />
                <DetailItem icon={CheckSquare} label="Trade Fair Rep" value={post.tradeFairRepresentation} />
                <DetailItem icon={CheckSquare} label="Online Sales Rep" value={post.onlineSalesRepresentation} />
                <DetailItem icon={CheckSquare} label="Retail Channel Dev" value={post.retailChannelDevelopment} />
              </div>

              <SectionHeading icon={DollarSign} title="Commercial Terms" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailItem icon={DollarSign} label="Engagement Type" value={post.engagementType} />
                <DetailItem icon={DollarSign} label="Commission Rate" value={post.commissionRate} />
                <DetailItem icon={DollarSign} label="Retainer" value={post.retainer} />
                <DetailItem icon={DollarSign} label="Fixed Charges" value={post.fixedCharges} />
                <DetailItem icon={DollarSign} label="Currency" value={post.currency} />
              </div>

              <SectionHeading icon={Package} title="Support Provided" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailItem icon={Package} label="Marketing Materials" value={post.marketingMaterials} />
                <DetailItem icon={CheckSquare} label="Product Training" value={post.productTraining} />
                <DetailItem icon={CheckSquare} label="Sample Product" value={post.sampleProduct} />
                <DetailItem icon={CheckSquare} label="Lead Support" value={post.leadSupport} />
                <DetailItem icon={CheckSquare} label="MSME Attend Expos" value={post.msmeAttendExpos} />
                <DetailItem icon={CheckSquare} label="Right to Work Required" value={post.rightToWorkRequired} />
                <DetailItem icon={CheckSquare} label="Company Preferred" value={post.companyPreferred} />
                <DetailItem icon={CheckSquare} label="Insurance Required" value={post.insuranceRequired} />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              {/* SP Specific Details */}
              <SectionHeading icon={Calendar} title="Event Details" />
              <div className="mb-4">
                <p className="text-xl font-serif font-bold text-gray-900">{post.eventName}</p>
                {post.description && (
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{post.description}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailItem icon={Calendar} label="Date" value={post.date} />
                <DetailItem icon={Clock} label="Time" value={post.time} />
                <DetailItem icon={Globe} label="Country" value={post.country} />
                <DetailItem icon={MapPin} label="City" value={post.city} />
                <DetailItem icon={MapPin} label="Venue" value={post.venue} />
                <DetailItem icon={Info} label="Expected Footfall" value={post.expectedFootfall} />
              </div>
              {post.eventUrl && (
                <div className="mt-4">
                  <a href={post.eventUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#701010] text-white rounded-lg text-sm font-bold w-full hover:bg-[#5a0c0c] transition-colors">
                    <ExternalLink className="w-4 h-4" /> View Event Link
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

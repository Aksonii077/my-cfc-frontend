import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Modal } from 'antd';
import { theme } from '@/lib/theme';
import { lookupPartner, claimPartnerProfile, type PartnerProfile, type PartnerLookupPayload } from '@/services/partnerApi';

interface PartnerFormData {
  name: string;
  email: string;
  phone: string;
  website?: string;
}

const PartnerProfileLookupPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (values: PartnerFormData) => {
    // Check if at least one field is filled
    if (!values.name && !values.email && !values.phone && !values.website) {
      message.warning('Please fill in at least one field to search for your profile');
      return;
    }

    setLoading(true);
    try {
      // Call backend API to check if partner exists
      // Note: We only send email and phone to the backend
      const payload: PartnerLookupPayload = {
        email: values.email || '',
        phone: values.phone || '',
      };

      const response = await lookupPartner(payload);

      if (response.success && response.data) {
        // Partner found, show profile
        setPartnerProfile(response.data);
        setShowForm(false);
        message.success('Partner profile found!');
        // Don't reset form - keep the data they entered
      } else {
        // No partner found
        message.info('No matching partner found. Your information has been recorded for review.');
        // Don't reset form - let them try again with different info
      }
    } catch (error: any) {
      console.error('Error looking up partner:', error);
      message.error(error.response?.data?.message || 'Failed to look up partner profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPartnerProfile(null);
    setShowForm(true);
    form.resetFields();
  };

  const handleClaimProfile = async () => {
    if (!partnerProfile?.id) {
      message.error('Partner profile ID not found');
      return;
    }

    Modal.confirm({
      title: 'Claim Your Profile',
      content: (
        <div>
          <p>Are you sure you want to claim this profile?</p>
          <p className="text-sm text-gray-600 mt-2">
            By claiming this profile, you'll be able to update information and connect with startups on our platform.
          </p>
        </div>
      ),
      okText: 'Yes, Claim Profile',
      cancelText: 'Cancel',
      okButtonProps: {
        style: { background: theme.gradients.primary }
      },
      onOk: async () => {
        setClaimLoading(true);
        try {
          const response = await claimPartnerProfile(partnerProfile.id);
          
          if (response.success) {
            message.success('Profile claimed successfully! Our team will review and activate your account shortly.');
            // Optionally refresh the profile or update UI
          } else {
            message.info(response.message || 'Profile claim request submitted');
          }
        } catch (error: any) {
          console.error('Error claiming profile:', error);
          message.error(error.response?.data?.message || 'Failed to claim profile. Please try again.');
        } finally {
          setClaimLoading(false);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 md:py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-[#114DFF] mb-4">
            Partner Portal
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            {showForm 
              ? 'Enter your details to access your partner profile or register as a new partner'
              : 'Your Partner Profile'
            }
          </p>
        </div>

        {showForm ? (
          /* Lookup Form */
          <Card className="shadow-xl rounded-2xl border-0">
            <div className="p-4 md:p-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-[#114DFF] mb-6">
                Partner Information
              </h2>
              
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                size="large"
                requiredMark="optional"
              >
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    { min: 2, message: 'Name must be at least 2 characters' }
                  ]}
                >
                  <Input 
                    placeholder="Enter your full name (optional)" 
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input 
                    placeholder="your.email@example.com (optional)" 
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[
                    { pattern: /^[\d\s\+\-\(\)]+$/, message: 'Please enter a valid phone number' }
                  ]}
                >
                  <Input 
                    placeholder="+91 98765 43210 (optional)" 
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label="Company Website"
                  name="website"
                  rules={[
                    { type: 'url', message: 'Please enter a valid URL' }
                  ]}
                >
                  <Input 
                    placeholder="https://www.yourcompany.com (optional)" 
                    className="rounded-lg"
                  />
                </Form.Item>

                <div className="mt-8">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                    className="h-12 text-lg font-semibold rounded-lg"
                    style={{ 
                      background: theme.gradients.primary,
                      border: 'none'
                    }}
                  >
                    {loading ? 'Searching...' : 'Continue'}
                  </Button>
                </div>
              </Form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Fill in any of the fields above to search for your profile. 
                  If your information matches our records, you'll be able to view and claim your partner profile.
                </p>
              </div>
            </div>
          </Card>
        ) : (
          /* Partner Profile Display */
          <Card className="shadow-xl rounded-2xl border-0">
            <div className="p-4 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#114DFF] mb-2">
                    {partnerProfile?.company_name || 'Partner Profile'}
                  </h2>
                  {partnerProfile?.partner_type && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {partnerProfile.partner_type}
                    </span>
                  )}
                </div>
                <Button 
                  onClick={handleReset}
                  className="rounded-lg"
                >
                  Lookup Another
                </Button>
              </div>

              <div className="space-y-6">
                {/* Company Information */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-[#114DFF] mb-4">
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {partnerProfile?.company_name && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Company Name</p>
                        <p className="text-lg font-semibold text-gray-800">{partnerProfile.company_name}</p>
                      </div>
                    )}
                    {partnerProfile?.industry_parent && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Industry</p>
                        <p className="text-lg font-semibold text-gray-800">{partnerProfile.industry_parent}</p>
                      </div>
                    )}
                    {partnerProfile?.industry_sub_category && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Category</p>
                        <p className="text-lg font-semibold text-gray-800">{partnerProfile.industry_sub_category}</p>
                      </div>
                    )}
                    {partnerProfile?.company_city && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">City</p>
                        <p className="text-lg font-semibold text-gray-800">{partnerProfile.company_city}</p>
                      </div>
                    )}
                    {partnerProfile?.employee_size && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Team Size</p>
                        <p className="text-lg font-semibold text-gray-800">{partnerProfile.employee_size}</p>
                      </div>
                    )}
                    {partnerProfile?.company_founding_year && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Founded</p>
                        <p className="text-lg font-semibold text-gray-800">{partnerProfile.company_founding_year}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                {partnerProfile?.company_address && (
                  <div className="bg-white border-2 border-gray-100 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-[#114DFF] mb-4">
                      📍 Location
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {partnerProfile.company_address}
                    </p>
                    {(partnerProfile.company_city || partnerProfile.company_pincode || partnerProfile.company_country) && (
                      <p className="text-gray-600 mt-2">
                        {[partnerProfile.company_city, partnerProfile.company_pincode, partnerProfile.company_country].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                )}

                {/* Contact Information */}
                {(partnerProfile?.company_contact_number || partnerProfile?.company_email) && (
                  <div className="bg-white border-2 border-gray-100 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-[#114DFF] mb-4">
                      📞 Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {partnerProfile?.company_contact_number && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Phone</p>
                          <a 
                            href={`tel:${partnerProfile.company_contact_number}`}
                            className="text-lg text-[#114DFF] hover:underline font-semibold"
                          >
                            {partnerProfile.company_contact_number}
                          </a>
                        </div>
                      )}
                      {partnerProfile?.company_email && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Email</p>
                          <a 
                            href={`mailto:${partnerProfile.company_email}`}
                            className="text-lg text-[#114DFF] hover:underline font-semibold"
                          >
                            {partnerProfile.company_email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Services & Business Details */}
                {(partnerProfile?.services_offered || partnerProfile?.industries_served || partnerProfile?.pricing_model) && (
                  <div className="bg-white border-2 border-gray-100 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-[#114DFF] mb-4">
                      Business Details
                    </h3>
                    <div className="space-y-4">
                      {partnerProfile?.services_offered && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Services Offered</p>
                          <p className="text-lg text-gray-800">{partnerProfile.services_offered}</p>
                        </div>
                      )}
                      {partnerProfile?.industries_served && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Industries Served</p>
                          <p className="text-lg text-gray-800">{partnerProfile.industries_served}</p>
                        </div>
                      )}
                      {partnerProfile?.pricing_model && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Pricing Model</p>
                          <p className="text-lg text-gray-800">{partnerProfile.pricing_model}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Overview */}
                {partnerProfile?.company_overview && (
                  <div className="bg-white border-2 border-gray-100 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-[#114DFF] mb-4">
                      About the Company
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {partnerProfile.company_overview}
                    </p>
                  </div>
                )}

                {/* Certifications */}
                {partnerProfile?.certifications && (
                  <div className="bg-white border-2 border-gray-100 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-[#114DFF] mb-4">
                      🏆 Certifications
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {partnerProfile.certifications}
                    </p>
                  </div>
                )}

                {/* Portfolio */}
                {partnerProfile?.portfolio && (
                  <div className="bg-white border-2 border-gray-100 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-[#114DFF] mb-4">
                      💼 Portfolio
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {partnerProfile.portfolio}
                    </p>
                  </div>
                )}

                {/* Links */}
                {(partnerProfile?.company_website || partnerProfile?.company_linkedin_url) && (
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-[#114DFF] mb-4">
                      🔗 Online Presence
                    </h3>
                    <div className="space-y-3">
                      {partnerProfile?.company_website && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Website</p>
                          <a 
                            href={partnerProfile.company_website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-lg text-[#114DFF] hover:underline break-all"
                          >
                            {partnerProfile.company_website}
                          </a>
                        </div>
                      )}
                      {partnerProfile?.company_linkedin_url && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">LinkedIn</p>
                          <a 
                            href={partnerProfile.company_linkedin_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-lg text-[#114DFF] hover:underline break-all"
                          >
                            {partnerProfile.company_linkedin_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 pt-4">
                  <Button
                    type="primary"
                    size="large"
                    block
                    loading={claimLoading}
                    disabled={claimLoading}
                    className="h-14 text-lg font-bold rounded-lg"
                    style={{ 
                      background: theme.gradients.primary,
                      border: 'none'
                    }}
                    onClick={handleClaimProfile}
                  >
                    🎯 Claim Your Profile
                  </Button>
                  
                  <div className="text-center text-sm text-gray-600">
                    Is this your business? Claim your profile to update information and connect with startups.
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help? Contact us at{' '}
            <a href="mailto:partners@cofoundercircle.com" className="text-[#114DFF] hover:underline">
              partners@cofoundercircle.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerProfileLookupPage;


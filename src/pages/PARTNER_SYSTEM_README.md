# Partner System Documentation

## Overview
The Partner System allows vendors, service providers, suppliers, and distributors to register and access their profiles on the CoFounder Circle platform.

## Features

### 1. Partner Landing Page (`/partner`)
- **Location**: `src/pages/PartnerPage.tsx`
- **Purpose**: Marketing page to attract partners
- **Features**:
  - Hero section with call-to-action
  - Partner types showcase (Vendors, Suppliers, Service Providers, Distributors)
  - Benefits section
  - How it works section
  - Multiple CTAs to direct to partner lookup page

### 2. Partner Profile Lookup Page (`/partner-lookup`)
- **Location**: `src/pages/PartnerProfileLookupPage.tsx`
- **Purpose**: Allow partners to access their profiles or submit new information
- **Features**:
  - Form with three fields:
    - Full Name
    - Email Address
    - Phone Number
  - Backend matching logic:
    - Matches on **email OR phone** (NOT name)
    - Name is used only for display/record purposes
  - Two states:
    1. **Form State**: Entry form for partner details
    2. **Profile State**: Display partner profile if found

### 3. Partner API Service
- **Location**: `src/services/partnerApi.ts`
- **Functions**:
  - `lookupPartner()`: Look up partner by email/phone
  - `registerPartner()`: Register new partner
  - `getPartnerProfile()`: Get partner by ID
  - `updatePartnerProfile()`: Update partner information

## API Integration

### Endpoint: `POST /partner/lookup`

**Request Payload**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210"
}
```

**Response (Success - Profile Found)**:
```json
{
  "success": true,
  "message": "Partner profile found",
  "data": {
    "id": "partner_123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210",
    "company_name": "Example Corp",
    "partner_type": "Service Provider",
    "services_offered": "Web Development, Design",
    "website": "https://example.com",
    "description": "Leading web development company",
    "status": "active",
    "verified": true
  }
}
```

**Response (No Match)**:
```json
{
  "success": false,
  "message": "No matching partner found"
}
```

### Backend Matching Logic
The backend should:
1. Search for partners where `email` matches OR `phone` matches
2. **Do NOT** use `name` for matching
3. Return 404 if no match is found
4. Optionally: Store the submission for manual review

## User Flow

### New Partner Flow
1. User visits `/partner` landing page
2. Clicks "Get Started" button
3. Redirected to `/partner-lookup`
4. Fills in name, email, and phone
5. Submits form
6. No match found → Success message shown, information recorded
7. User notified that their submission is under review

### Existing Partner Flow
1. User visits `/partner` landing page or goes directly to `/partner-lookup`
2. Fills in their registered email or phone (and name)
3. Submits form
4. Backend finds match on email OR phone
5. Profile is displayed with:
   - Basic information
   - Partner details (type, services)
   - Company information
   - Verification status
   - Account status
6. User can access dashboard (when implemented)

## Partner Profile Data Structure

```typescript
interface PartnerProfile {
  id: string;                    // Unique identifier
  name: string;                  // Partner contact name
  email: string;                 // Partner email (used for matching)
  phone: string;                 // Partner phone (used for matching)
  company_name?: string;         // Company name
  partner_type?: string;         // Type: vendor, supplier, service_provider, distributor
  services_offered?: string;     // Description of services
  website?: string;              // Company website
  description?: string;          // About the partner
  status?: string;               // active, pending, inactive
  verified?: boolean;            // Verification status
  created_at?: string;           // Creation timestamp
  updated_at?: string;           // Last update timestamp
}
```

## Styling & Theme
- Uses the same design system as the mentor page
- Primary gradient from theme: `theme.gradients.primary`
- Primary color: `#114DFF`
- Accent color: `#3CE5A7`
- Responsive design for mobile and desktop

## Routes

| Route | Component | Layout | Protected |
|-------|-----------|--------|-----------|
| `/partner` | PartnerPage | PublicLayout | No |
| `/partner-lookup` | PartnerProfileLookupPage | PublicLayout | No |

## Future Enhancements
1. Partner Dashboard
2. Edit profile functionality
3. Connection with startups
4. Messaging system
5. Analytics for partner engagement
6. Document uploads
7. Portfolio showcase
8. Reviews and ratings

## Testing Checklist
- [ ] Landing page loads correctly
- [ ] All CTAs navigate to `/partner-lookup`
- [ ] Form validation works for all fields
- [ ] Email format validation
- [ ] Phone number format validation
- [ ] API call on form submission
- [ ] Success message when partner found
- [ ] Info message when no partner found
- [ ] Profile display shows all available data
- [ ] "Lookup Another" button resets to form
- [ ] Responsive design on mobile and tablet
- [ ] Loading states work correctly
- [ ] Error handling displays appropriate messages

## Related Files
- `src/pages/PartnerPage.tsx` - Landing page
- `src/pages/PartnerProfileLookupPage.tsx` - Lookup and profile display
- `src/services/partnerApi.ts` - API service
- `src/routes/AppRoutes.tsx` - Route configuration
- `src/lib/theme.ts` - Theme configuration
- `src/utils/api.ts` - Base API client


# Partner Backend Integration Guide

## Overview
This document describes the backend API requirements for the Partner system.

## Important Matching Logic
⚠️ **Critical**: The backend MUST match partners on **email OR phone**, NOT on name.
- Name is only used for display and record-keeping
- Matching should be case-insensitive for email
- Phone numbers should be normalized before matching (remove spaces, dashes, etc.)

## API Endpoints Required

### 1. Partner Lookup
**Endpoint**: `POST /partners/check`

**Purpose**: Look up an existing partner by email or phone number

**Request Body**:
```json
{
  "email": "john@example.com",
  "phone": "+91 98765 43210"
}
```

**Example cURL**:
```bash
curl -X POST http://localhost:8000/partners/check \
  -H "Content-Type: application/json" \
  -d '{"email": "contact@acme.com", "phone": "+1234567890"}'
```

**Backend Logic**:
```python
# Pseudocode for backend matching logic
def check_partner(email, phone):
    # Normalize inputs
    email_normalized = email.lower().strip()
    phone_normalized = normalize_phone(phone)  # Remove spaces, dashes, etc.
    
    # Search for partner - Match on email OR phone
    partner = db.partners.find_one({
        "$or": [
            {"email": email_normalized},
            {"phone": phone_normalized}
        ]
    })
    
    if partner:
        # Partner found
        return {
            "success": True,
            "message": "Partner profile found",
            "data": {
                "id": partner.id,
                "name": partner.name,
                "email": partner.email,
                "phone": partner.phone,
                "company_name": partner.company_name,
                "partner_type": partner.partner_type,
                "services_offered": partner.services_offered,
                "website": partner.website,
                "description": partner.description,
                "status": partner.status,
                "verified": partner.verified
            }
        }
    else:
        # No partner found - optionally store for review
        store_partner_inquiry(email, phone)
        
        # Return 404 or success with no data
        return 404, {
            "success": False,
            "message": "No matching partner found"
        }
```

**Success Response (200)**:
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
    "partner_type": "service_provider",
    "services_offered": "Web Development, UI/UX Design",
    "website": "https://example.com",
    "description": "Leading web development company specializing in startup solutions",
    "status": "active",
    "verified": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z"
  }
}
```

**Not Found Response (404)**:
```json
{
  "success": false,
  "message": "No matching partner found"
}
```

**Error Response (400/500)**:
```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error for debugging"
}
```

### 2. Partner Registration (Optional - for future use)
**Endpoint**: `POST /partners/register`

**Purpose**: Register a new partner

**Request Body**:
```json
{
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "name": "John Doe",
  "company_name": "Example Corp",
  "partner_type": "service_provider",
  "services_offered": "Web Development",
  "website": "https://example.com",
  "description": "About the company"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Partner registered successfully",
  "data": {
    "id": "partner_123",
    "status": "pending_review"
  }
}
```

### 3. Get Partner Profile (Optional - for future use)
**Endpoint**: `GET /partners/{partner_id}`

**Purpose**: Get partner profile by ID

**Response**: Same as lookup success response

### 4. Update Partner Profile (Optional - for future use)
**Endpoint**: `PUT /partners/{partner_id}`

**Purpose**: Update partner information

## Database Schema

### Partners Collection/Table
```typescript
{
  id: string,                      // Primary key
  name: string,                    // Partner contact name
  email: string,                   // Unique, indexed, lowercase
  phone: string,                   // Unique, indexed, normalized
  company_name: string | null,     // Company name
  partner_type: string | null,     // vendor, supplier, service_provider, distributor
  services_offered: string | null, // Services description
  website: string | null,          // Company website URL
  description: string | null,      // About the partner
  status: string,                  // active, pending, inactive, rejected
  verified: boolean,               // Verification status
  created_at: datetime,            // Creation timestamp
  updated_at: datetime,            // Last update timestamp
  created_by: string | null,       // Admin who created/approved
  metadata: object | null          // Additional flexible data
}
```

### Indexes Required
```sql
CREATE INDEX idx_partner_email ON partners(email);
CREATE INDEX idx_partner_phone ON partners(phone);
CREATE INDEX idx_partner_status ON partners(status);
```

### Partner Inquiries Collection/Table (Optional)
For storing inquiries from people who aren't yet in the system:
```typescript
{
  id: string,
  name: string,
  email: string,
  phone: string,
  inquiry_date: datetime,
  status: string,  // new, contacted, converted, rejected
  converted_to_partner_id: string | null,
  notes: string | null
}
```

## Phone Number Normalization

### Example Normalization Function
```python
import re

def normalize_phone(phone):
    """
    Normalize phone number by removing all non-digit characters
    and standardizing the format.
    """
    # Remove all non-digit characters except +
    phone = re.sub(r'[^\d+]', '', phone)
    
    # If starts with +91 (India), keep it
    # If starts with 91 without +, add +
    # If starts with 0, remove it and add country code
    
    if phone.startswith('+'):
        return phone
    elif phone.startswith('91') and len(phone) >= 12:
        return '+' + phone
    elif phone.startswith('0'):
        return '+91' + phone[1:]
    else:
        return '+91' + phone
```

## Email Normalization

### Example Normalization Function
```python
def normalize_email(email):
    """
    Normalize email to lowercase and strip whitespace
    """
    return email.lower().strip()
```

## Security Considerations

1. **Rate Limiting**: Implement rate limiting on the lookup endpoint to prevent abuse
   - Suggestion: 10 requests per minute per IP
   
2. **Input Validation**:
   - Validate email format
   - Validate phone number format
   - Sanitize all inputs to prevent injection attacks
   
3. **Authentication** (Future):
   - Consider requiring authentication for profile updates
   - Currently lookup is public (no auth required)

4. **Data Privacy**:
   - Only return necessary profile information
   - Consider GDPR/data protection requirements
   - Log access to partner profiles for audit trail

## Testing

### Test Cases

1. **Exact Email Match**:
   - Input: `{"email": "john@example.com", "phone": "+1234567890"}`
   - Expected: Find partner with exact email

2. **Case-Insensitive Email**:
   - Input: `{"email": "JOHN@EXAMPLE.COM", "phone": "+1234567890"}`
   - Expected: Find partner with `john@example.com`

3. **Phone Match with Different Formatting**:
   - Stored: `+919876543210`
   - Input: `{"email": "other@example.com", "phone": "+91 98765 43210"}` or `"9876543210"`
   - Expected: Find the partner

4. **No Match**:
   - Input: Email and phone that don't exist
   - Expected: 404 response

5. **Partial Match on Email Only**:
   - Input: Email matches, phone doesn't
   - Expected: Find partner (OR condition)

6. **Partial Match on Phone Only**:
   - Input: Phone matches, email doesn't
   - Expected: Find partner (OR condition)

7. **Example cURL Test**:
   ```bash
   curl -X POST http://localhost:8000/partners/check \
     -H "Content-Type: application/json" \
     -d '{"email": "contact@acme.com", "phone": "+1234567890"}'
   ```

### Sample Test Data
```json
[
  {
    "id": "partner_001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "company_name": "Example Corp",
    "partner_type": "service_provider",
    "status": "active",
    "verified": true
  },
  {
    "id": "partner_002",
    "name": "Jane Smith",
    "email": "jane@supplier.com",
    "phone": "+919123456789",
    "company_name": "Supply Co",
    "partner_type": "supplier",
    "status": "pending",
    "verified": false
  }
]
```

## Frontend Integration

The frontend uses these services from `src/services/partnerApi.ts`:
- `lookupPartner(payload)` - Calls `POST /partners/check`
- `registerPartner(payload)` - Calls `POST /partners/register`
- `getPartnerProfile(partnerId)` - Calls `GET /partners/{partnerId}`
- `updatePartnerProfile(partnerId, updates)` - Calls `PUT /partners/{partnerId}`

**Note**: The frontend form collects name, email, and phone, but only email and phone are sent to the `/partners/check` endpoint. Name is stored locally for display purposes only.

Base URL is configured in: `VITE_API_BASE_URL` environment variable

## Error Handling

The frontend handles these scenarios:
- **200 + success: true**: Partner found, display profile
- **200 + success: false** or **404**: No partner found, show info message
- **400**: Bad request, show error message
- **500**: Server error, show generic error message
- **Network error**: Show connection error message

## Deployment Checklist

- [ ] Database tables/collections created
- [ ] Indexes created on email and phone
- [ ] Phone normalization function implemented
- [ ] Email normalization function implemented
- [ ] Lookup endpoint implemented with correct matching logic (email OR phone)
- [ ] Rate limiting configured
- [ ] Input validation added
- [ ] Error responses standardized
- [ ] Test data seeded
- [ ] All test cases passing
- [ ] CORS configured for frontend domain
- [ ] Logging added for audit trail
- [ ] Documentation updated

## Questions?

Contact: tech@cofoundercircle.com


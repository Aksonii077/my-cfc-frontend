# Mentor Onboarding API Integration

## API Endpoint
```
POST /mentor-onboarding/verification
```

## Request Headers
- `Authorization: Bearer {JWT_TOKEN}` (automatically added by apiClient)
- `Content-Type: application/json`

## Request Payload Structure
```json
{
  "name": "John Doe",
  "number": "+1234567890", 
  "linkedin_url": "https://www.linkedin.com/in/johndoe",
  "years_of_experience": "5-10",
  "area_of_expertise": "Fintech, Product Strategy, Marketing",
  "bio": "Experienced entrepreneur with 10+ years in fintech..."
}
```

## Response Structure
```json
{
  "success": true,
  "message": "Mentor application submitted successfully",
  "data": {
    "id": "mentor_123",
    "status": "pending_review"
  }
}
```

## Error Handling
- All API errors are handled automatically by the `apiClient` interceptors
- Validation errors are shown in the form
- Network errors trigger error messages via antd message
- 401 errors automatically log out the user

## Analytics Events
- `mentor_interest_submit` - When form is submitted
- `mentor_interest_submit_success` - When API call succeeds
- `mentor_interest_submit_failed` - When API call fails
- `mentor_interest_validation_error` - When form validation fails

## Form Validation
- **LinkedIn URL**: Optional field - validates format only if value is provided
- **Bio**: Required field - maximum 150 characters
- **Expertise**: Required field - at least one area must be selected, maximum 5
- **Years of Experience**: Required field - must select from dropdown

## Data Transformation
The form data is automatically transformed from the frontend format to the API format:

**Frontend Form Data:**
```typescript
{
  linkedinUrl: string  // Optional - only validated if provided
  bio: string          // Required - max 150 characters
  expertise: string[]  // Required - 1-5 selections
  yearsOfExperience: string  // Required
}
```

**API Payload:**
- `name`: Combined from `userInfo.firstName` and `userInfo.lastName`
- `number`: Combined from `userInfo.countryCode` and `userInfo.phone`
- `linkedin_url`: From `formData.linkedinUrl`
- `years_of_experience`: From `formData.yearsOfExperience`
- `area_of_expertise`: Joined array from `formData.expertise`
- `bio`: From `formData.bio`

## Usage
The API integration is automatically handled when the user submits the mentor onboarding form. No additional configuration is required.
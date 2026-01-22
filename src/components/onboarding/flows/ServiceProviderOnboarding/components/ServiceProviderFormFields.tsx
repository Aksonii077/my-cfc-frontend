import { Card, CardContent } from '../../../../ui/card'
import { Label } from '../../../../ui/label'
import { Textarea } from '../../../../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../ui/select'
import { Badge } from '../../../../ui/badge'
import { X } from 'lucide-react'
import { SERVICE_CATEGORIES, EXPERIENCE_OPTIONS } from '../constants/serviceProviderConstants'
import type { ServiceProviderFormData } from '../services/serviceProviderApi'


interface Props {
  formData: ServiceProviderFormData
  errors: Record<string, string>
  onUpdateField: (field: keyof ServiceProviderFormData, value: any) => void
  onAddService: (service: string) => void
  onRemoveService: (service: string) => void
}

export function ServiceProviderFormFields({
  formData,
  errors,
  onUpdateField,
  onAddService,
  onRemoveService
}: Props) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        {/* Bio */}
        <div>
          <Label htmlFor="bio">About Your Business *</Label>
          <Textarea
            id="bio"
            placeholder="Describe your business and services..."
            value={formData.bio}
            onChange={(e) => onUpdateField('bio', e.target.value)}
            rows={4}
            className={errors.bio ? 'border-red-500' : ''}
          />
          {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
        </div>

        {/* Services */}
        <div>
          <Label>Services Offered * (Max 5)</Label>
          <Select onValueChange={onAddService}>
            <SelectTrigger className={errors.services ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select services..." />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.services.map((service) => (
              <Badge key={service} variant="secondary" className="flex items-center gap-1">
                {service}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => onRemoveService(service)}
                />
              </Badge>
            ))}
          </div>
          {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
        </div>

        {/* Business Type */}
        <div>
          <Label>Business Type *</Label>
          <Select value={formData.businessType} onValueChange={(val) => onUpdateField('businessType', val)}>
            <SelectTrigger className={errors.businessType ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select business type..." />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
        </div>

        {/* Years of Experience */}
        <div>
          <Label>Years of Experience *</Label>
          <Select value={formData.yearsOfExperience} onValueChange={(val) => onUpdateField('yearsOfExperience', val)}>
            <SelectTrigger className={errors.yearsOfExperience ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select experience..." />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.yearsOfExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

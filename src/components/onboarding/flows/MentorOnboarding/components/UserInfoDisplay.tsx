import React from 'react'
import { Input } from '../../../../ui/input'
import type { UserInfoData } from '../../../types'

interface UserInfoDisplayProps {
  userInfo: UserInfoData
}

export const UserInfoDisplay: React.FC<UserInfoDisplayProps> = ({ userInfo }) => (
  <div className="space-y-2">
    <h3 className="text-gray-900 text-sm">Your Information</h3>
    
    <div className="grid grid-cols-2 gap-1.5">
      <Input
        value={userInfo.firstName}
        disabled
        placeholder="First Name"
        className="bg-gray-50 border-[#C8D6FF] h-7 text-xs"
        aria-label="First Name"
      />
      <Input
        value={userInfo.lastName}
        disabled
        placeholder="Last Name"
        className="bg-gray-50 border-[#C8D6FF] h-7 text-xs"
        aria-label="Last Name"
      />
    </div>

    <Input
      value={userInfo.email}
      disabled
      placeholder="Email"
      className="bg-gray-50 border-[#C8D6FF] h-7 text-xs"
      aria-label="Email"
    />
    
    <Input
      value={`${userInfo.countryCode} ${userInfo.phone}`}
      disabled
      placeholder="Phone"
      className="bg-gray-50 border-[#C8D6FF] h-7 text-xs"
      aria-label="Phone"
    />
  </div>
)
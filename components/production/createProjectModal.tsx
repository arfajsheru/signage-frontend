"use client"

import { BaseModal } from "@/components/comman/BaseModal"
import { useGetBusinessTypes, useGetStageTypes, useGetChannelPartners } from "@/hooks/use-dropdown"
import SearchSelect from "@/components/shadcn-studio/combobox/search-select"
import { StudioInput } from "@/components/shadcn-studio/input/studio-input"
import { Label } from "@/components/ui/label"
import { TextArea } from "@/components/shadcn-studio/textarea/TextArea"
import { useState, useEffect } from "react"
import { User } from "@/types/auth"
import { MapModal } from "@/components/map/MapModal"
import { MapPin } from "lucide-react"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  type: "signage" | "print"
}

export function CreateProjectModal({ isOpen, onClose, type }: CreateProjectModalProps) {
  const [user, setUser] = useState<User | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    businessTypeId: "",
    stageTypeId: "",
    channelPartnerId: "",
  })

  const [isMapOpen, setIsMapOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [isOpen])

  // Fetch Dropdown Data
  const { data: businessTypes, isLoading: loadingBT } = useGetBusinessTypes()
  const { data: stageTypes, isLoading: loadingST } = useGetStageTypes()
  const { data: channelPartners, isLoading: loadingCP } = useGetChannelPartners(
    user?.vendor_id ? Number(user.vendor_id) : 0
  )

  // Map data to options
  const businessTypeOptions = businessTypes?.data?.map(bt => ({
    value: String(bt.id),
    label: bt.name
  })) || []

  const stageTypeOptions = stageTypes?.data?.map(st => ({
    value: String(st.id),
    label: st.name
  })) || []

  const channelPartnerOptions = channelPartners?.data?.map(cp => ({
    value: String(cp.id),
    label: cp.name
  })) || []

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title={`Create New ${type === 'signage' ? 'Signage' : 'Print'} Job`}
        description={`Fill in the details below to initialize a new production project for the ${type} module.`}
        size="xl"
        primaryButtonText="Submit"
        secondaryButtonText="Cancel"
        onPrimaryAction={() => {
          // TODO: handle submit
          console.log("Submitting form:", formData)
          onClose()
        }}
      >
        <div className="space-y-5 py-2">
          <StudioInput
            id="project-name"
            label="Project Name"
            placeholder="Enter project name..."
            className="h-10 bg-muted/30 border-border/40 focus:bg-background transition-all"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />

          <div className="space-y-2 relative">
            <div className="flex justify-between items-center mb-[-0.5rem] relative z-10">
              <button
                type="button"
                onClick={() => setIsMapOpen(true)}
                className="absolute right-0 top-0 text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md transition-colors"
              >
                <MapPin className="h-3 w-3" />
                Open Map
              </button>
            </div>
            <TextArea
              id="address"
              label="Project Address"
              placeholder="Enter or select project address..."
              className="min-h-[60px] bg-muted/30 border-border/40 focus:bg-background transition-all resize-none"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <SearchSelect
                label="Business Type"
                placeholder={loadingBT ? "Loading..." : "Select type"}
                options={businessTypeOptions}
                value={formData.businessTypeId}
                onValueChange={(val) => handleInputChange("businessTypeId", val)}
                className="h-10 max-w-none"
              />
            </div>
            <div className="space-y-2">
              <SearchSelect
                label="Initial Stage"
                placeholder={loadingST ? "Loading..." : "Select stage"}
                options={stageTypeOptions}
                value={formData.stageTypeId}
                onValueChange={(val) => handleInputChange("stageTypeId", val)}
                className="h-10 max-w-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <SearchSelect
              label="Channel Partner"
              placeholder={loadingCP ? "Loading..." : "Select partner"}
              options={channelPartnerOptions}
              value={formData.channelPartnerId}
              onValueChange={(val) => handleInputChange("channelPartnerId", val)}
              className="h-10 max-w-none"
            />
          </div>

          <TextArea
            id="description"
            label="Notes / Description"
            placeholder="Add project details or notes..."
            className="min-h-[80px] bg-muted/30 border-border/40 focus:bg-background transition-all resize-none"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>
      </BaseModal>
    <MapModal 
      isOpen={isMapOpen} 
      onClose={() => setIsMapOpen(false)} 
      onLocationSelect={(addr) => handleInputChange("address", addr)} 
    />
  </>
)
}

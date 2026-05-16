"use client"

import { BaseModal } from "@/components/comman/BaseModal"
import { useGetBusinessTypes, useGetChannelPartners } from "@/hooks/use-dropdown"
import SearchSelect from "@/components/shadcn-studio/combobox/search-select"
import { StudioInput } from "@/components/shadcn-studio/input/studio-input"
import { TextArea } from "@/components/shadcn-studio/textarea/TextArea"
import { useState, useEffect } from "react"
import { User } from "@/types/auth"
import { MapModal } from "@/components/map/MapModal"
import { MapPin } from "lucide-react"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/shadcn-studio/input/phone-input"
import { DateInput } from "@/components/shadcn-studio/date-picker/date-input"
import { useCreateProject } from "@/hooks/use-project"
import { z } from "zod"

const projectSchema = z.object({
  name: z.string().min(1, "Project Name is required"),
  client_name: z.string().optional(),
  client_email: z.string().email("Invalid email format").optional().or(z.literal("")),
  client_phone: z.string().optional(),
  site_address: z.string().optional(),
  site_map_link: z.string().optional(),
  business_type_id: z.string().min(1, "Business Type is required"),
  channel_partner_id: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  total_amount: z.string().optional(),
  advance_paid: z.string().optional(),
  notes: z.string().optional(),
  deadline: z.date({
    required_error: "Project Deadline is required",
    invalid_type_error: "Project Deadline is required",
  })
})

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
    client_name: "",
    client_email: "",
    client_phone: "",
    site_address: "",
    site_map_link: "",
    business_type_id: "",
    channel_partner_id: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    total_amount: "",
    advance_paid: "",
    notes: "",
    deadline: undefined as Date | undefined,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isMapOpen, setIsMapOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [isOpen])

  // Fetch Dropdown Data
  const { data: businessTypes, isLoading: loadingBT } = useGetBusinessTypes()
  const { data: channelPartners, isLoading: loadingCP } = useGetChannelPartners(
    user?.vendor_id ? Number(user.vendor_id) : 0
  )

  // Mutations
  const { mutate: createProject, isPending } = useCreateProject()

  // Map data to options
  const businessTypeOptions = businessTypes?.data?.map(bt => ({
    value: String(bt.id),
    label: bt.name
  })) || []

  const channelPartnerOptions = channelPartners?.data?.map(cp => ({
    value: String(cp.id),
    label: cp.name
  })) || []

  const priorityOptions = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
    { value: "URGENT", label: "Urgent" },
 
  ]

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    console.log("--- Form Submission Started ---")
    console.log("Current Form Data:", formData)
    
    const result = projectSchema.safeParse(formData)
    
    if (!result.success) {
      const formattedErrors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        formattedErrors[issue.path[0]] = issue.message
      })
      setErrors(formattedErrors)
      console.error("Validation failed:", formattedErrors)
      return
    }

    setErrors({})

    const payload = {
      name: result.data.name,
      client_name: result.data.client_name || "",
      business_type_id: Number(result.data.business_type_id),
      client_phone: result.data.client_phone || "",
      client_email: result.data.client_email || "",
      site_address: result.data.site_address || "",
      site_map_link: result.data.site_map_link || "",
      notes: result.data.notes || "",
      priority: result.data.priority,
      channel_partner_id: result.data.channel_partner_id ? Number(result.data.channel_partner_id) : 0,
      total_amount: Number(result.data.total_amount) || 0,
      advance_paid: Number(result.data.advance_paid) || 0,
      deadline: result.data.deadline.toISOString()
    }

    console.log("Creating project with payload:", payload)
    
    createProject(payload, {
      onSuccess: () => {
        alert("Project created successfully!")
        setFormData({
          name: "",
          client_name: "",
          client_email: "",
          client_phone: "",
          site_address: "",
          site_map_link: "",
          business_type_id: "",
          channel_partner_id: "",
          priority: "MEDIUM",
          total_amount: "",
          advance_paid: "",
          notes: "",
          deadline: undefined,
        })
        setErrors({})
        onClose()
      },
      onError: (err) => {
        alert("Failed to create project. Please try again.")
        console.error(err)
      }
    })
  }

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title={`Create New ${type === 'signage' ? 'Signage' : 'Print'} Job`}
        description={`Fill in the details below to initialize a new production project for the ${type} module.`}
        size="xl"
        primaryButtonText={isPending ? "Creating..." : "Submit"}
        secondaryButtonText="Cancel"
        onPrimaryAction={handleSubmit}
      >
        <div className="space-y-6 py-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Row 1: Project Name & Client Name */}
            <div className="space-y-2">
              <StudioInput
                id="project-name"
                label="Project Name *"
                placeholder="Enter project name..."
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={errors.name}
              />
            </div>
            <div className="space-y-2">
              <StudioInput
                id="client-name"
                label="Client Name"
                placeholder="Enter client name..."
                value={formData.client_name}
                onChange={(e) => handleInputChange("client_name", e.target.value)}
                error={errors.client_name}
              />
            </div>

            {/* Row 2: Client Phone & Client Email */}
            <div className="space-y-2">
              <Label htmlFor="client-phone" className="text-sm font-bold">Client Phone</Label>
              <PhoneInput
                id="client-phone"
                placeholder="Enter client phone..."
                value={formData.client_phone as any}
                onChange={(val) => handleInputChange("client_phone", val || "")}
                disableCountry
                className={errors.client_phone ? "[&>input]:border-destructive" : ""}
              />
              {errors.client_phone && <p className="text-xs font-medium text-destructive">{errors.client_phone}</p>}
            </div>
            <div className="space-y-2">
              <StudioInput
                id="client-email"
                type="email"
                label="Client Email"
                placeholder="Enter client email..."
                value={formData.client_email}
                onChange={(e) => handleInputChange("client_email", e.target.value)}
                error={errors.client_email}
              />
            </div>

            {/* Full Width Site Address */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="site_address" className="text-sm font-bold">Site Address</Label>
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md transition-colors"
                >
                  <MapPin className="h-3 w-3" />
                  Open Map
                </button>
              </div>
              <TextArea
                id="site_address"
                placeholder="Enter or select site address..."
                className="min-h-[40px] resize-none"
                value={formData.site_address}
                onChange={(e) => handleInputChange("site_address", e.target.value)}
                error={errors.site_address}
              />
            </div>

            {/* Row 4: Business Type & Channel Partner */}
            <div className="space-y-2">
              <SearchSelect
                label="Business Type *"
                placeholder={loadingBT ? "Loading..." : "Select business type"}
                options={businessTypeOptions}
                value={formData.business_type_id}
                onValueChange={(val) => handleInputChange("business_type_id", val)}
                error={errors.business_type_id}
              />
            </div>
            <div className="space-y-2">
              <SearchSelect
                label="Channel Partner"
                placeholder={loadingCP ? "Loading..." : "Select channel partner"}
                options={channelPartnerOptions}
                value={formData.channel_partner_id}
                onValueChange={(val) => handleInputChange("channel_partner_id", val)}
                error={errors.channel_partner_id}
              />
            </div>

            {/* Row 5: Priority & Project Deadline */}
            <div className="space-y-2">
              <SearchSelect
                label="Priority"
                placeholder="Select priority"
                options={priorityOptions}
                value={formData.priority}
                onValueChange={(val) => handleInputChange("priority", val as any)}
                error={errors.priority}
              />
            </div>
            <div className="space-y-2">
              <DateInput
                label="Project Deadline *"
                value={formData.deadline}
                onChange={(date) => handleInputChange("deadline", date)}
                placeholder="Select project deadline"
                error={errors.deadline}
              />
            </div>

            {/* Row 6: Total Amount & Advance Paid */}
            <div className="space-y-2">
              <StudioInput
                id="total-amount"
                type="number"
                label="Total Amount"
                placeholder="Enter total amount..."
                value={formData.total_amount}
                onChange={(e) => handleInputChange("total_amount", e.target.value)}
                error={errors.total_amount}
              />
            </div>
            <div className="space-y-2">
              <StudioInput
                id="advance-paid"
                type="number"
                label="Advance Paid"
                placeholder="Enter advance paid..."
                value={formData.advance_paid}
                onChange={(e) => handleInputChange("advance_paid", e.target.value)}
                error={errors.advance_paid}
              />
            </div>

            {/* Full Width Notes */}
            <div className="md:col-span-2">
              <TextArea
                id="notes"
                label="Notes / Description"
                placeholder="Add project details or notes..."
                className="min-h-[80px] resize-none"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                error={errors.notes}
              />
            </div>
          </div>
        </div>
      </BaseModal>
      <MapModal 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        onLocationSelect={(addr) => handleInputChange("site_address", addr)} 
      />
    </>
  )
}

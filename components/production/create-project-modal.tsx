"use client"

import { BaseModal } from "@/components/comman/BaseModal"
import {
  useGetBusinessTypes,
  useGetChannelPartners,
  useGetProjectCategories,
} from "@/hooks/use-dropdown"
import SearchSelect from "@/components/shadcn-studio/combobox/search-select"
import { StudioInput } from "@/components/shadcn-studio/input/studio-input"
import { TextArea } from "@/components/shadcn-studio/textarea/TextArea"
import { useState, useEffect } from "react"
import { User } from "@/types/auth"
import { MapModal } from "@/components/map/MapModal"
import { MapPin, User as UserIcon, Handshake, ChevronRight } from "lucide-react"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/shadcn-studio/input/phone-input"
import { DateInput } from "@/components/shadcn-studio/date-picker/date-input"
import { useCreateProject } from "@/hooks/use-project"
import { z } from "zod"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const projectSchema = z.object({
  name: z.string().min(1, "Project Name is required"),
  project_source: z.enum(["DIRECT", "CHANNEL_PARTNER"]),
  client_name: z.string().optional(),
  client_email: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  client_phone: z.string().optional(),
  site_address: z.string().optional(),
  site_map_link: z.string().optional(),
  business_type_id: z.string().min(1, "Business Type is required"),
  channel_partner_id: z.string().optional(),
  project_category_id: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  total_amount: z.string().optional(),
  advance_paid: z.string().optional(),
  notes: z.string().optional(),
  deadline: z.date({
    required_error: "Project Deadline is required",
    invalid_type_error: "Project Deadline is required",
  }),
}).refine((data) => {
  if (data.project_source === "DIRECT") {
    return !!data.client_name && data.client_name.trim().length > 0;
  }
  return true;
}, {
  message: "Client Name is required for direct projects",
  path: ["client_name"],
}).refine((data) => {
  if (data.project_source === "CHANNEL_PARTNER") {
    return !!data.channel_partner_id && data.channel_partner_id.trim().length > 0;
  }
  return true;
}, {
  message: "Channel Partner is required for channel partner projects",
  path: ["channel_partner_id"],
})

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  type: "signage" | "print"
}

export function CreateProjectModal({
  isOpen,
  onClose,
  type,
}: CreateProjectModalProps) {
  const [user, setUser] = useState<User | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    project_source: "DIRECT" as "DIRECT" | "CHANNEL_PARTNER",
    client_name: "",
    client_email: "",
    client_phone: "",
    site_address: "",
    site_map_link: "",
    business_type_id: "",
    channel_partner_id: "",
    project_category_id: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    total_amount: "",
    advance_paid: "",
    notes: "",
    deadline: undefined as Date | undefined,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [orderSource, setOrderSource] = useState<"direct" | "partner">("direct")

  const handleOrderSourceChange = (source: "direct" | "partner") => {
    setOrderSource(source)
    const project_source = source === "direct" ? "DIRECT" : "CHANNEL_PARTNER"
    // Clear conflicting fields when switching
    if (source === "partner") {
      setFormData((prev) => ({
        ...prev,
        project_source,
        client_name: "",
        client_email: "",
        client_phone: "",
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        project_source,
        channel_partner_id: "",
      }))
    }
    setErrors({})
  }

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
  const { data: projectCategories, isLoading: loadingPC } = useGetProjectCategories(
    formData.business_type_id ? Number(formData.business_type_id) : 0
  )

  // Mutations
  const { mutate: createProject, isPending } = useCreateProject()

  // Map data to options
  const businessTypeOptions =
    businessTypes?.data?.map((bt) => ({
      value: String(bt.id),
      label: bt.name,
    })) || []

  const channelPartnerOptions =
    channelPartners?.data?.map((cp) => ({
      value: String(cp.id),
      label: cp.name,
    })) || []

  const projectCategoryOptions =
    projectCategories?.data?.map((cat) => ({
      value: String(cat.id),
      label: cat.category_name,
    })) || []

  const priorityOptions = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
    { value: "URGENT", label: "Urgent" },
  ]

  const handleInputChange = (
    field: string,
    value: string | Date | undefined
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      if (field === "business_type_id") {
        next.project_category_id = "" // Reset category when business type changes
      }
      return next
    })
  }

  const handleSubmit = () => {
    console.log("--- Form Submission Started ---")
    console.log("Current Form Data:", formData)

    const result = projectSchema.safeParse(formData)

    if (!result.success) {
      const formattedErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0]] = issue.message
      })
      setErrors(formattedErrors)
      console.error("Validation failed:", formattedErrors)
      toast.error("Please fix the validation errors.")
      return
    }

    setErrors({})

    const payload = {
      name: result.data.name,
      project_source: result.data.project_source,
      client_name: result.data.client_name || "",
      business_type_id: Number(result.data.business_type_id),
      client_phone: result.data.client_phone || "",
      client_email: result.data.client_email || "",
      site_address: result.data.site_address || "",
      site_map_link: result.data.site_map_link || "",
      notes: result.data.notes || "",
      priority: result.data.priority,
      channel_partner_id: result.data.channel_partner_id
        ? Number(result.data.channel_partner_id)
        : 0,
      total_amount: Number(result.data.total_amount) || 0,
      advance_paid: Number(result.data.advance_paid) || 0,
      deadline: result.data.deadline.toISOString(),
      project_category_id: result.data.project_category_id
        ? Number(result.data.project_category_id)
        : 0,
    }

    console.log("Creating project with payload:", payload)

    createProject(payload, {
      onSuccess: () => {
        toast.success("Project created successfully!")
        setFormData({
          name: "",
          project_source: "DIRECT",
          client_name: "",
          client_email: "",
          client_phone: "",
          site_address: "",
          site_map_link: "",
          business_type_id: "",
          channel_partner_id: "",
          project_category_id: "",
          priority: "MEDIUM",
          total_amount: "",
          advance_paid: "",
          notes: "",
          deadline: undefined,
        })
        setErrors({})
        setOrderSource("direct")
        onClose()
      },
      onError: (err) => {
        toast.error("Failed to create project. Please try again.")
        console.error(err)
      },
    })
  }

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title={`Create New ${type === "signage" ? "Signage" : "Print"} Job`}
        description={`Fill in the details below to initialize a new production project for the ${type} module.`}
        size="xl"
        primaryButtonText={isPending ? "Creating..." : "Submit"}
        secondaryButtonText="Cancel"
        onPrimaryAction={handleSubmit}
      >
        <div className="space-y-6 pt-0 pb-2">

          {/* ── Order Source Toggle ── */}
          <div className="space-y-3">
            <Label className="text-sm font-bold">
              Order Source
            </Label>
            <div className="flex rounded-xl border bg-muted/40 p-1 gap-1">
              <button
                type="button"
                onClick={() => handleOrderSourceChange("direct")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 border",
                  orderSource === "direct"
                    ? "bg-background border-primary/50 text-primary shadow-sm shadow-primary/5"
                    : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10"
                )}
              >
                <UserIcon className="h-4 w-4" />
                Direct Client
              </button>
              <button
                type="button"
                onClick={() => handleOrderSourceChange("partner")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 border",
                  orderSource === "partner"
                    ? "bg-background border-primary/50 text-primary shadow-sm shadow-primary/5"
                    : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10"
                )}
              >
                <Handshake className="h-4 w-4" />
                Via Channel Partner
              </button>
            </div>
            {orderSource === "partner" && (
              <p className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground/80 pl-1">
                <ChevronRight className="h-3 w-3" />
                Client info will be managed by the channel partner
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Row 1: Project Name & (Client Name or Channel Partner) */}
            <div className="space-y-3">
              <StudioInput
                id="project-name"
                label="Project Name *"
                placeholder="Enter project name..."
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={errors.name}
              />
            </div>

            {orderSource === "direct" ? (
              <div className="space-y-3">
                <StudioInput
                  id="client-name"
                  label="Client Name *"
                  placeholder="Enter client name..."
                  value={formData.client_name}
                  onChange={(e) =>
                    handleInputChange("client_name", e.target.value)
                  }
                  error={errors.client_name}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <SearchSelect
                  label="Channel Partner *"
                  placeholder={loadingCP ? "Loading..." : "Select channel partner"}
                  options={channelPartnerOptions}
                  value={formData.channel_partner_id}
                  onValueChange={(val) =>
                    handleInputChange("channel_partner_id", val)
                  }
                  error={errors.channel_partner_id}
                />
              </div>
            )}

            {/* Row 2: Conditionally show Client Phone & Email OR Business Type only */}
            {orderSource === "direct" && (
              <>
                <div className="space-y-3">
                  <Label htmlFor="client-phone" className="text-sm font-bold">
                    Client Phone
                  </Label>
                  <PhoneInput
                    id="client-phone"
                    placeholder="Enter client phone..."
                    value={formData.client_phone as any}
                    onChange={(val) => handleInputChange("client_phone", val || "")}
                    disableCountry
                    className={
                      errors.client_phone ? "[&>input]:border-destructive" : ""
                    }
                  />
                  {errors.client_phone && (
                    <p className="text-xs font-medium text-destructive mt-1.5 pl-1">
                      {errors.client_phone}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <StudioInput
                    id="client-email"
                    type="email"
                    label="Client Email"
                    placeholder="Enter client email..."
                    value={formData.client_email}
                    onChange={(e) =>
                      handleInputChange("client_email", e.target.value)
                    }
                    error={errors.client_email}
                  />
                </div>
              </>
            )}

            {/* Full Width Site Address */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center justify-between mb-1 pl-0.5">
                <Label htmlFor="site_address" className="text-sm font-bold">
                  Site Address
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setIsMapOpen(true)}
                        className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        <MapPin className="h-3 w-3" />
                        Open Map
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pick location from Google Maps</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <TextArea
                id="site_address"
                placeholder="Enter or select site address..."
                className="min-h-[40px] resize-none"
                value={formData.site_address}
                onChange={(e) =>
                  handleInputChange("site_address", e.target.value)
                }
                error={errors.site_address}
              />
            </div>

            {/* Row 4: Business Type & Project Category */}
            <div className="space-y-3">
              <SearchSelect
                label="Business Type *"
                placeholder={loadingBT ? "Loading..." : "Select business type"}
                options={businessTypeOptions}
                value={formData.business_type_id}
                onValueChange={(val) =>
                  handleInputChange("business_type_id", val)
                }
                error={errors.business_type_id}
              />
            </div>
            {formData.business_type_id ? (
              <div className="space-y-3">
                <SearchSelect
                  label="Project Category"
                  placeholder={loadingPC ? "Loading..." : "Select project category"}
                  options={projectCategoryOptions}
                  value={formData.project_category_id}
                  onValueChange={(val) =>
                    handleInputChange("project_category_id", val)
                  }
                  error={errors.project_category_id}
                />
              </div>
            ) : (
              <div className="hidden md:block" />
            )}

            {/* Row 5: Priority & Project Deadline */}
            <div className="space-y-3">
              <SearchSelect
                label="Priority *"
                placeholder="Select priority"
                options={priorityOptions}
                value={formData.priority}
                onValueChange={(val) =>
                  handleInputChange("priority", val as any)
                }
                error={errors.priority}
              />
            </div>
            <div className="space-y-3">
              <DateInput
                label="Project Deadline *"
                value={formData.deadline}
                onChange={(date) => handleInputChange("deadline", date)}
                placeholder="Select project deadline"
                error={errors.deadline}
              />
            </div>

            {/* Row 6: Total Amount & Advance Paid */}
            <div className="space-y-3">
              <StudioInput
                id="total-amount"
                type="number"
                label="Total Amount"
                placeholder="Enter total amount..."
                value={formData.total_amount}
                onChange={(e) =>
                  handleInputChange("total_amount", e.target.value)
                }
                error={errors.total_amount}
              />
            </div>
            <div className="space-y-3">
              <StudioInput
                id="advance-paid"
                type="number"
                label="Advance Paid"
                placeholder="Enter advance paid..."
                value={formData.advance_paid}
                onChange={(e) =>
                  handleInputChange("advance_paid", e.target.value)
                }
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
        onLocationSelect={(addr, mapLink) => {
          handleInputChange("site_address", addr)
          if (mapLink) {
            handleInputChange("site_map_link", mapLink)
          }
        }}
      />
    </>
  )
}

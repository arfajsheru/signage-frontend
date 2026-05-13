"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ButtonShineHover from "@/components/shadcn-studio/button/button-41"
import { motion, AnimatePresence } from "framer-motion"
import { useGetBusinessTypes, useGetStageTypes, useGetChannelPartners } from "@/hooks/use-dropdown"
import SearchSelect from "@/components/shadcn-studio/combobox/search-select"
import { StudioInput } from "@/components/shadcn-studio/input/studio-input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { User } from "@/types/auth"

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
    businessTypeId: "",
    stageTypeId: "",
    channelPartnerId: "",
  })

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent 
            forceMount
            className="sm:max-w-[500px] p-0 border-none bg-transparent shadow-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: { 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300,
                  duration: 0.3 
                } 
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95, 
                y: 10,
                transition: { duration: 0.2 } 
              }}
              className="p-6 border border-border/50 bg-background shadow-2xl rounded-2xl relative overflow-hidden"
            >
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-black tracking-tight">
                  Create New <span className="capitalize">{type}</span> Job
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                  Fill in the details below to initialize a new production project for the {type} module.
                </DialogDescription>
              </DialogHeader>

              <div className="py-6 space-y-5 border-y border-dashed border-border/60 my-6">
                <StudioInput
                  id="project-name"
                  label="Project Name"
                  placeholder="Enter project name..."
                  className="h-10 bg-muted/30 border-border/40 focus:bg-background transition-all"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />

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

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-bold">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Add project details or notes..." 
                    className="min-h-[80px] bg-muted/30 border-border/40 focus:bg-background transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <ButtonShineHover 
                  variant="outline" 
                  onClick={onClose} 
                  className="h-10 px-6 border-border/50 hover:bg-muted"
                >
                  Cancel
                </ButtonShineHover>
                <ButtonShineHover 
                  className="h-10 px-8 bg-primary shadow-lg shadow-primary/20"
                >
                  Submit
                </ButtonShineHover>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}

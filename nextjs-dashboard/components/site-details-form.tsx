import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { SiteDetailsFormProps, SiteDetail, STATE_CHOICES, STATE_MAP } from '@/lib/definitions';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Check, ChevronsUpDown } from "lucide-react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { fetchSiteDetails, submitSiteDetails } from "@/lib/api";
import { set } from "date-fns";

import { cn } from "@/lib/utils"


// Define the schema for form validation using Zod
const formSchema = z.object({
  site_name: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  latitude: z.preprocess((val) => parseFloat(val as string), z.number().min(-90).max(90)),
  longitude: z.preprocess((val) => parseFloat(val as string), z.number().min(-180).max(180)),
  contract_start_month: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).max(12)),
  contract_end_month: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).max(12)),
});

// Define form fields 
const formFields: { 
  name: keyof z.infer<typeof formSchema>; 
  label: string; 
  placeholder: string; 
}[] = [
  { name: 'site_name', label: 'Site Name', placeholder: 'Enter site name' },
  { name: 'address', label: 'Address', placeholder: 'Enter address' },
  { name: 'city', label: 'City', placeholder: 'Enter city' },
  { name: 'state', label: 'State', placeholder: 'Select state' },
  { name: 'latitude', label: 'Latitude', placeholder: 'Enter latitude' },
  { name: 'longitude', label: 'Longitude', placeholder: 'Enter longitude' },
  { name: 'contract_start_month', label: 'Contract Start Month', placeholder: 'Enter contract start month'},
  { name: 'contract_end_month', label: 'Contract End Month', placeholder: 'Enter contract end month'},
];


const SiteDetailsForm: React.FC<SiteDetailsFormProps> = ({ site_id, siteDetails, onUpdateSiteDetails}) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Use react-hook-form to create the form with zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      site_name: siteDetails?.site_name || "",
      address: siteDetails?.address || "",
      city: siteDetails?.city || "",
      state: siteDetails?.state,
      latitude: siteDetails?.latitude,
      longitude: siteDetails?.longitude,
      contract_start_month: siteDetails?.contract_start_month,
      contract_end_month: siteDetails?.contract_end_month,
    },
  });

  // UseEffect to update the form default values when siteDetails changes
  useEffect(() => {
    if (siteDetails) {
      form.reset({
        site_name: siteDetails?.site_name || "",
        address: siteDetails?.address || "",
        city: siteDetails?.city || "",
        state: siteDetails?.state,
        latitude: siteDetails?.latitude,
        longitude: siteDetails?.longitude,
        contract_start_month: siteDetails?.contract_start_month,
        contract_end_month: siteDetails?.contract_end_month,
      });
    }
  }, [siteDetails, form]);

  // Form submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
       const siteData = {
      site_id: site_id,  // Include site_id in the siteData
      ...values,
      latitude: values.latitude?.toString(),
      longitude: values.longitude?.toString(),
      contract_start_month: values.contract_start_month?.toString(),
      contract_end_month: values.contract_end_month?.toString(),
    };

    console.log("Form submitted", siteData);
    const response = await submitSiteDetails(site_id, siteData);
    console.log("Response received:", response);

    const { site_id: responseSiteId, ...rest } = response;

    const updatedSiteDetails = {
      ...rest,
      latitude: parseFloat(response.latitude),
      longitude: parseFloat(response.longitude),
      contract_start_month: parseInt(response.contract_start_month),
      contract_end_month: parseInt(response.contract_end_month)
    }

    onUpdateSiteDetails(updatedSiteDetails);
    setIsSuccess(true);
    }catch(error) {
      console.error("Failed to submit:", error);
      setIsSuccess(false); // Set failure status
    } finally {
      setAlertOpen(true); // Open the alert dialog
    }
   
      
  };

  const renderInputField = (name: keyof z.infer<typeof formSchema>, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem >
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={`Enter ${label.toLowerCase()}`} type='text' {...field}/>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const redernComboField = (name: keyof z.infer<typeof formSchema>, label: string) => ( <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <FormControl>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                >
                  {field.value
                    ? `${field.value} - ${STATE_MAP[field.value as keyof typeof STATE_MAP]}`
                    : `Select ${label.toLowerCase()}`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
            </FormControl>
            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
              <Command>
                <CommandInput placeholder="Search a state..." className="border-0 focus-visible:ring-0"/>
                <CommandList>
                  <CommandEmpty>No State found.</CommandEmpty>
                  <CommandGroup>
                    {Object.entries(STATE_MAP).map(([abbreviation, fullName]) => (
                      <CommandItem
                        key={abbreviation}
                        value={abbreviation}
                        onSelect={() => {
                          form.setValue(name, abbreviation);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            abbreviation === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {`${abbreviation} - ${fullName}`}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 min-w-0">
          {/* Render each field individually */}
          {formFields.map(({ name, label }) => {
            return name === "state"
              // ? renderSelectField(name as keyof z.infer<typeof formSchema>, label, STATE_CHOICES)\
              ? redernComboField(name as keyof z.infer<typeof formSchema>, label)
              : renderInputField(name as keyof z.infer<typeof formSchema>, label);
          })}

          {/* Submit Button */}
          <div className="grid justify-items-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isSuccess ? "Successful" : "Failure"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isSuccess ? "The site details have been successfully submitted." : "There was an error submitting the site details. Please try again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
);

};


export default SiteDetailsForm;
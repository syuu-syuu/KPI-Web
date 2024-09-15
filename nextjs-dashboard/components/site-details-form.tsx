import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { SiteDetailsFormProps, SiteDetail, STATE_CHOICES } from '@/lib/definitions';

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

type FormSchemaKeys = keyof z.infer<typeof formSchema>;

// Define form fields with layout configuration
const formFields: { 
  name: FormSchemaKeys; 
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


export const SiteDetailsForm: React.FC<SiteDetailsFormProps> = ({ site_id, siteDetails, onUpdateSiteDetails}) => {
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
    const siteData = {
      ...values,
      site_id: site_id,  // Include site_id in the siteData
      latitude: values.latitude?.toString(),
      longitude: values.longitude?.toString(),
      contract_start_month: values.contract_start_month?.toString(),
      contract_end_month: values.contract_end_month?.toString(),
    };

    console.log("Form submitted", siteData);
    const response = await submitSiteDetails(site_id, siteData);
    console.log("Response:", response);

    const { site_id: responseSiteId, ...rest } = response;

    const updatedSiteDetails = {
      ...rest,
      latitude: parseFloat(response.latitude),
      longitude: parseFloat(response.longitude),
      contract_start_month: parseInt(response.contract_start_month),
      contract_end_month: parseInt(response.contract_end_month)
    }

    onUpdateSiteDetails(updatedSiteDetails);
      
  };

  const renderInputField = (name: keyof z.infer<typeof formSchema>, label: string, type: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={`Enter ${label.toLowerCase()}`} type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderSelectField = (name: keyof z.infer<typeof formSchema>, label: string, options: string[]) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value?.toString()}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );


  return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      {/* Render each field individually */}
      {formFields.map(({ name, label }) => {
        return name === "state"
          ? renderSelectField(name as keyof z.infer<typeof formSchema>, label, STATE_CHOICES)
          : renderInputField(name as keyof z.infer<typeof formSchema>, label, "text");
      })}

      {/* Submit Button */}
      <div className="grid justify-items-end">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  </Form>
);

};


export default SiteDetailsForm;
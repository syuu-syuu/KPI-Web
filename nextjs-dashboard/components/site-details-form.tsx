import React, { useEffect } from "react";
import { SiteDetail } from '@/lib/definitions';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
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

interface SiteDetailsFormProps {
  siteDetails: SiteDetail | undefined;
}

// Define the schema for form validation using Zod
const formSchema = z.object({
  site_name: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  latitude: z.union([z.string(), z.number()]).optional(),  
  longitude: z.union([z.string(), z.number()]).optional(), 
  contract_start_month: z.union([z.string(), z.number()]).optional(), 
  contract_end_month: z.union([z.string(), z.number()]).optional(),  
});

type FormSchemaKeys = keyof z.infer<typeof formSchema>;

// Define form fields with layout configuration
const formFields: { 
  name: FormSchemaKeys; 
  label: string; 
  placeholder: string; 
  wrapperClassName?: string;  
}[] = [
  { name: 'site_name', label: 'Site Name', placeholder: 'Enter site name' },
  { name: 'address', label: 'Address', placeholder: 'Enter address' },
  { name: 'city', label: 'City', placeholder: 'Enter city', wrapperClassName: 'flex-1' },
  { name: 'state', label: 'State', placeholder: 'Enter state', wrapperClassName: 'flex-1' },
  { name: 'latitude', label: 'Latitude', placeholder: 'Enter latitude', wrapperClassName: 'flex-1' },
  { name: 'longitude', label: 'Longitude', placeholder: 'Enter longitude', wrapperClassName: 'flex-1' },
  { name: 'contract_start_month', label: 'Contract Start Month', placeholder: 'Enter contract start month', wrapperClassName: 'flex-1' },
  { name: 'contract_end_month', label: 'Contract End Month', placeholder: 'Enter contract end month', wrapperClassName: 'flex-1' },
];


export const SiteDetailsForm: React.FC<SiteDetailsFormProps> = ({ siteDetails }) => {
  // Use react-hook-form to create the form with zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      site_name: siteDetails?.site_name || "",
      address: siteDetails?.address || "",
      city: siteDetails?.city || "",
      state: siteDetails?.state || "",
      latitude: siteDetails?.latitude || "",
      longitude: siteDetails?.longitude|| "",
      contract_start_month: siteDetails?.contract_start_month || "",
      contract_end_month: siteDetails?.contract_end_month || "",
    },
  });


  // UseEffect to update the form default values when siteDetails changes
  useEffect(() => {
    if (siteDetails) {
      form.reset({
        site_name: siteDetails?.site_name || "",
        address: siteDetails?.address || "",
        city: siteDetails?.city || "",
        state: siteDetails?.state || "",
        latitude: siteDetails?.latitude || "",
        longitude: siteDetails?.longitude || "",
        contract_start_month: siteDetails?.contract_start_month || "",
        contract_end_month: siteDetails?.contract_end_month || "",
      });
    }
  }, [siteDetails, form]);

  // Form submit handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted", values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {/* Rendering grouped form fields */}
        {['site_name', 'address'].map((name) => (
          <FormField
            key={name}
            control={form.control}
            name={name as FormSchemaKeys}
            render={({ field }) => {
              const currentField = formFields.find(f => f.name === name);
              return (
                <FormItem className="flex items-center space-x-4">
                  <FormLabel className="flex-grow whitespace-nowrap">{currentField?.label}</FormLabel>
                  <FormControl>
                    <Input placeholder={currentField?.placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        ))}

        {/* Render city and state in one line */}
        <div className="flex space-x-4">
          {['city', 'state'].map((name) => (
            <FormField
              key={name}
              control={form.control}
              name={name as FormSchemaKeys}
              render={({ field }) => {
                const currentField = formFields.find(f => f.name === name);
                return (
                  <FormItem  className={`${currentField?.wrapperClassName ?? ''} flex items-center space-x-4`}>
                    <FormLabel className="flex-grow whitespace-nowrap">{currentField?.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={currentField?.placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          ))}
        </div>

        {/* Render latitude and longitude in one line */}
        <div className="flex space-x-4">
          {['latitude', 'longitude'].map((name) => (
            <FormField
              key={name}
              control={form.control}
              name={name as FormSchemaKeys}
              render={({ field }) => {
                const currentField = formFields.find(f => f.name === name);
                return (
                  <FormItem  className={`${currentField?.wrapperClassName ?? ''} flex items-center space-x-4`}>
                    <FormLabel className="flex-grow whitespace-nowrap">{currentField?.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={currentField?.placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          ))}
        </div>

        {/* Render contract start and end month in one line */}
        <div className="flex space-x-4">
          {['contract_start_month', 'contract_end_month'].map((name) => (
            <FormField
              key={name}
              control={form.control}
              name={name as FormSchemaKeys}
              render={({ field }) => {
                const currentField = formFields.find(f => f.name === name);
                return (
                  <FormItem className={`${currentField?.wrapperClassName ?? ''} flex items-center space-x-4`} >
                    <FormLabel className="flex-grow whitespace-nowrap">{currentField?.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={currentField?.placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          ))}
        </div>
        <div className="grid justify-items-end">
          <Button type="submit" >Submit</Button>
        </div>
        
      </form>
    </Form>
  );
};


export default SiteDetailsForm;
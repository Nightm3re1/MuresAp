'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CheckCircle2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { apartments as apartmentData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import type { DateRange } from 'react-day-picker';

interface SignupFormProps {
  className?: string;
}

// Read the webhook URL from the Netlify environment (must be defined as NEXT_PUBLIC_MAKE_WEBHOOK_URL)
const WEBHOOK_URL = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL!;

export function SignupForm({ className }: SignupFormProps) {
  const t = useTranslations('SignupForm');
  const commonT = useTranslations('Common');
  const { toast } = useToast();
  const locale = useLocale();

  const formSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    phone: z.string().min(7, { message: 'Phone number must be at least 7 characters.' }),
    apartmentId: z.string().min(1, { message: 'Please select an apartment.' }),
    dates: z
      .custom<DateRange | undefined>(
        (val) =>
          val === undefined ||
          (typeof val === 'object' && val !== null && 'from' in val && 'to' in val),
        'Please select a date range'
      )
      .refine(
        (val) => val !== undefined && val.from !== undefined && val.to !== undefined,
        {
          message: 'Please select a complete date range.',
        }
      ),
    message: z
      .string()
      .min(10, { message: 'Message must be at least 10 characters.' })
      .max(500, { message: 'Message cannot exceed 500 characters.' }),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      apartmentId: '',
      dates: undefined,
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const apartmentName =
          apartmentData.find((ap) => ap.id === data.apartmentId)?.name[locale] ||
          apartmentData.find((ap) => ap.id === data.apartmentId)?.name['en'] ||
          'the selected apartment';

        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>{t('submitSuccess')}</span>
            </div>
          ),
          description: t('submitSuccessDescription', { apartmentName }),
        });
        form.reset();
      } else {
        console.error('Webhook submission failed:', response.status, await response.text());
        toast({
          variant: 'destructive',
          title: (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
              <span>{commonT('error')}</span>
            </div>
          ),
          description: t('submitError'),
        });
      }
    } catch (error) {
      console.error('Error submitting form to webhook:', error);
      toast({
        variant: 'destructive',
        title: (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
            <span>{commonT('error')}</span>
          </div>
        ),
        description: t('submitError'),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'w-full max-w-xl p-8 space-y-6 bg-card text-card-foreground rounded-xl shadow-2xl',
        className
      )}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* form fields… */}
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? commonT('loading') : t('submitButton')}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}

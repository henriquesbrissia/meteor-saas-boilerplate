import { zodResolver } from "@hookform/resolvers/zod";
import { Meteor } from "meteor/meteor";
import { useForm } from "react-hook-form";

import type { TwoFactorFormProps, TwoFaFormValues } from "/imports/api/auth/schemas";
import { twofaSchema } from "/imports/api/auth/schemas";
import { useToast } from "/imports/hooks/use-toast";

import { Button } from "../elements/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../elements/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../elements/input-otp";

export const TwoFactorForm = ({ email, password, onSuccess }: TwoFactorFormProps) => {
  const { toast } = useToast();
  const form = useForm<TwoFaFormValues>({
    defaultValues: { twofaCode: "" },
    resolver: zodResolver(twofaSchema)
  });

  const onSubmit = (data: TwoFaFormValues) => {
    Meteor.loginWithPasswordAnd2faCode(email, password, data.twofaCode, (error: Meteor.Error) => {
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Error verifying 2FA code.",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Success",
        description: "2FA verification successful. You are now logged in!",
        variant: "default"
      });
      form.reset();
      onSuccess();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="twofaCode"
          render={({ field }) => (
            <FormItem className="justify-items-center text-center">
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password displayed in your authenticator app
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.twofaCode && (
          <p className="text-red-500 text-sm">{form.formState.errors.twofaCode.message}</p>
        )}
        <div className="flex justify-end py-4">
          <Button type="submit" size="lg" className="w-full">
            {form.formState.isSubmitting ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

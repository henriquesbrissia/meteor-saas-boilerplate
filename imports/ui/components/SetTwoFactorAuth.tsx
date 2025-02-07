import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Buffer } from "buffer";
import { Accounts } from "meteor/accounts-base";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { TwoFaFormValues } from "/imports/api/auth/schemas";
import { twofaSchema } from "/imports/api/auth/schemas";

import { api } from "../api";
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
import { useToast } from "../hooks/use-toast";

export const SetTwoFactorAuth = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<"disabled" | "pending" | "enabled">("disabled");

  const { data: user } = api.users.loggedUser.useQuery();

  const form = useForm<TwoFaFormValues>({
    defaultValues: { twofaCode: "" },
    resolver: zodResolver(twofaSchema)
  });

  const { toast } = useToast();

  const generateQRCode = () => {
    Accounts.generate2faActivationQrCode("Meteor SaaS BP", (err, result) => {
      if (err) {
        toast({
          title: "Error",
          description: err.message || "Error verifying 2FA code.",
          variant: "destructive"
        });
      } else {
        const { svg, secret, uri } = result;
        const base64Svg = Buffer.from(svg).toString("base64");
        setQrCode(base64Svg);
        setStatus("pending");
      }
    });
  };

  const queryClient = useQueryClient();

  const onSubmit = (data: TwoFaFormValues) => {
    Accounts.enableUser2fa(data.twofaCode, async (err) => {
      if (err) {
        toast({
          title: "Error",
          description: err.message || "Error verifying 2FA code.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "2FA enabled successfully!"
        });
        setStatus("enabled");
        form.reset();
        await queryClient.invalidateQueries();
      }
    });
  };

  const disable2fa = () => {
    Accounts.disableUser2fa(async (err) => {
      if (err) {
        toast({
          title: "Error",
          description: err.message || "Error disabling 2FA.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "2FA disabled successfully!"
        });
        setQrCode(null);
        setStatus("disabled");
        await queryClient.invalidateQueries();
      }
    });
  };

  return (
    <>
      <div className="p-8 rounded-md shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Two-Factor Authentication</h1>
        <p className="text-sm text-gray-500">
          Enhance the security of your account by enabling two-factor authentication (2FA).
        </p>
      </div>
      <div className="bg-slate-50 p-8 rounded-md shadow-sm">
        {user?.hasTwoFAEnabled ? (
          <>
            <p className="text-sm text-gray-600">
              Two-Factor Authentication is currently{" "}
              <span className="font-bold text-black">Enabled</span> on your account.
            </p>
            <Button onClick={disable2fa} className="shadow-md mt-4">
              Disable 2FA
            </Button>
          </>
        ) : status === "pending" ? (
          <div className="justify-items-center text-center">
            <p className="text-sm text-gray-600">
              Scan this QR code with your authenticator app (e.g. Google Authenticator), then enter
              the code below to enable 2FA.
            </p>
            {qrCode && (
              <img
                width={200}
                src={`data:image/svg+xml;base64,${qrCode}`}
                alt="2FA QR Code"
                className="my-4"
              />
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="twofaCode"
                  render={({ field }) => (
                    <FormItem className="justify-items-center">
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
                        Please enter the one-time password displayed in your authenticator app.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end mt-4">
                  <Button type="submit" className="w-24">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Two-Factor Authentication is currently{" "}
              <span className="font-bold text-black">Disabled</span> on your account.
            </p>
            <Button onClick={generateQRCode} className="shadow-md mt-4">
              Generate Activation Code
            </Button>
          </>
        )}
      </div>
    </>
  );
};

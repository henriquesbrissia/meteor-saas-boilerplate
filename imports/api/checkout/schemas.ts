import { z } from "zod";

export const createSessionSchema = z.undefined();

export const getSubscriptionSchema = z.undefined();

export const subscriptionDetailsSchema = z.object({
  isActive: z.boolean(),
  plan: z.string(),
  id: z.string(),
  status: z.string(),
  nextBilling: z.string(),
  price: z.number(),
  cicle: z.string()
});
export type SubscriptionDetails = z.infer<typeof subscriptionDetailsSchema>;

export const cancelSubscriptionSchema = z.string();
export type CancelSubscriptionValues = z.infer<typeof cancelSubscriptionSchema>;

export const checkoutSessionSchema = z.object({
  id: z.string(),
  clientSecret: z.string()
});
export type CheckoutSession = z.infer<typeof checkoutSessionSchema>;

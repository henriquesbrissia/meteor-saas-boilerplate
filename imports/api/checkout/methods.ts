import { createModule } from "grubba-rpc";
import { Meteor } from "meteor/meteor";
import Stripe from "stripe";

import { UsersCollection } from "../users/collection";
import { cancelSubscriptionSchema, createSessionSchema, getSubscriptionSchema } from "./schemas";

const StripeSecretKey = Meteor.settings.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(StripeSecretKey);

export const checkoutModule = createModule("checkout")
  .addMethod("createSession", createSessionSchema, async () => {
    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        line_items: [
          {
            quantity: 1,
            price: Meteor.settings.STRIPE_PRICE_ID as string
          }
        ],
        mode: "subscription",
        payment_method_types: ["card"],
        return_url: Meteor.absoluteUrl("checkout-complete?session_id={CHECKOUT_SESSION_ID}")
      });
      return { id: session.id, clientSecret: session.client_secret };
    } catch (e) {
      const error = e as Meteor.Error;
      throw new Meteor.Error("Stripe error", error.message);
    }
  })
  .addMethod("getSubscriptionStatus", getSubscriptionSchema, async () => {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error("Not authorized");
    }
    const user = await UsersCollection.findOneAsync({ _id: userId });
    const email =
      user?.emails?.[0].address || user?.services?.github?.email || user?.services?.google?.email;

    const customers = await stripe.customers.list({
      limit: 1,
      email: email,
      expand: ["data.subscriptions"]
    });

    if (customers.data.length === 0) {
      return null;
    }

    const customer = customers.data[0];
    const subscription = customer.subscriptions?.data[0];

    if (!subscription) {
      return null;
    }

    const isActive = subscription.status === "active";

    return isActive;
  })
  .addMethod("getSubscriptionDetails", getSubscriptionSchema, async () => {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error("Not authorized");
    }
    const user = await UsersCollection.findOneAsync({ _id: userId });
    const email =
      user?.emails?.[0].address || user?.services?.github?.email || user?.services?.google?.email;

    const customers = await stripe.customers.list({
      limit: 1,
      email: email,
      expand: ["data.subscriptions"]
    });

    if (customers.data.length === 0) {
      return null;
    }

    const customer = customers.data[0];
    const subscription = customer.subscriptions?.data[0];

    if (!subscription) {
      return null;
    }

    return {
      isActive: subscription.status === "active",
      plan: subscription.items.data[0].plan.nickname,
      id: subscription.id,
      status: subscription.status,
      nextBilling: new Date(subscription.current_period_end * 1000).toLocaleDateString(),
      price: subscription.items.data[0].plan.amount,
      cicle: subscription.items.data[0].plan.interval
    };
  })
  .addMethod("cancelSubscription", cancelSubscriptionSchema, async (subscriptionId) => {
    try {
      await stripe.subscriptions.cancel(subscriptionId);
    } catch (e) {
      const error = e as Meteor.Error;
      throw new Meteor.Error("Stripe error", error.message);
    }
  })
  .buildSubmodule();

import { createTypedCollection } from "create-typed-collection";
import { Meteor } from "meteor/meteor";

import { usersSchema } from "./schemas";

export const UsersCollection = createTypedCollection({
  instance: Meteor.users,
  schema: usersSchema,
  customCollectionMethods: {}
});

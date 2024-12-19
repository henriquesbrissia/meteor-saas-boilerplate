import { createTypedCollection } from "create-typed-collection";

import { teamSchema } from "./schemas";

export const TeamsCollection = createTypedCollection({
  name: "teams",
  schema: teamSchema,
  customCollectionMethods: {}
});

import { createModule } from "grubba-rpc";

import { UsersCollection } from "./collection";
import { usersFindAllSchema } from "./schemas";

export const usersModule = createModule("users")
  .addMethod("findAll", usersFindAllSchema, async () => {
    const users = await UsersCollection.find().fetchAsync();
    return users;
  })
  .buildSubmodule();

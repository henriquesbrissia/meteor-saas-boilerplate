import { createModule } from "grubba-rpc";
import { usersFindAllSchema } from "./schemas";
import { UsersCollection } from "./collection";

export const usersModule = createModule("users").addMethod("findAll", usersFindAllSchema, async () => {
  const users = await UsersCollection.find().fetchAsync()
  return users
}).buildSubmodule()
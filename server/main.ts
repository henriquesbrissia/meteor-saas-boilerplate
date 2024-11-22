import { createModule } from 'grubba-rpc';
import { Meteor } from 'meteor/meteor';
import { usersModule } from '/imports/api/users/methods';

Meteor.startup(async () => {

});

const server = createModule().addSubmodule(usersModule).build()
export type Server = typeof server
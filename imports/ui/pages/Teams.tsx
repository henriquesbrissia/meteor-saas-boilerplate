import { Users } from "lucide-react";
import { Meteor } from "meteor/meteor";

import { api } from "../api";
import { AddMemberDialog } from "../components/AddMemberDialog";
import { AppSidebar } from "../components/AppSidebar";
import { CreateTeamDialog } from "../components/CreateTeamDialog";
import { EditRoleDialog } from "../components/EditRoleDialog";
import { EditTeamDialog } from "../components/EditTeamDialog";
import { RemoveMemberDialog } from "../components/RemovememberDialog";
import { TeamBadge } from "../components/TeamBadge";
import { SidebarProvider, SidebarTrigger } from "../elements/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../elements/table";
import { Toaster } from "../elements/toaster";

export const Teams = () => {
  const userId = Meteor.userId();
  if (!userId) return <p>You must be logged in to continue</p>;

  const { data: teams = [], isLoading, error } = api.teams.getUserTeams.useQuery({ _id: userId });

  if (isLoading) return <p>Loading teams...</p>;

  if (error) return <p>Error loading teams: {error.message}</p>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-col h-screen w-full">
        <div className="bg-white shadow-sm">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold pb-4 pl-14 pt-7">
            Your Teams <Users className="inline pb-1 ml-1" />
          </h1>
        </div>
        <div className="flex-col max-w-5xl mx-auto p-8">
          {teams?.length ? (
            <ul className="space-y-8">
              {teams.map((team) => (
                <div
                  key={team._id}
                  className="border border-gray-200 p-6 bg-white shadow-md rounded-xl"
                >
                  <div className="text-xl font-bold mb-4 flex justify-between">
                    <h2 className="flex items-center">
                      {team.name}
                      {team.isAdmin && <EditTeamDialog teamId={team._id} name={team.name} />}
                    </h2>
                    <TeamBadge ownerId={team.ownerId} />
                  </div>
                  <Table className="mb-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {team.users.length > 0 ? (
                        team.users.map(
                          (user) =>
                            user._id && (
                              <TableRow key={user._id}>
                                <TableCell>
                                  {user?.profile?.name ||
                                    user?.services?.github?.name ||
                                    user?.services?.google?.name}
                                </TableCell>
                                <TableCell>
                                  {user?.emails?.[0]?.address ||
                                    user?.services?.github?.email ||
                                    user?.services?.google?.email}
                                </TableCell>
                                <TableCell>
                                  {user.role || "N/A"}
                                  {user._id !== userId && team.isAdmin && (
                                    <EditRoleDialog
                                      teamId={team._id}
                                      memberId={user?._id || ""}
                                      memberName={user?.profile?.name || "Member"}
                                      role={user?.role}
                                    />
                                  )}
                                </TableCell>
                                <TableCell>
                                  {new Date(user.joinedAt).toLocaleDateString() || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {user._id !== userId && team.isAdmin && (
                                    <RemoveMemberDialog
                                      teamId={team._id}
                                      memberId={user?._id || ""}
                                      memberName={user?.profile?.name || "Member"}
                                    />
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                        )
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            No members in this team
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  {team.isAdmin && <AddMemberDialog teamId={team._id} />}
                </div>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You have no teams yet.</p>
          )}
          <div className="flex justify-center p-8">
            <CreateTeamDialog />
          </div>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

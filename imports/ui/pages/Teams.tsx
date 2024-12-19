import { Users } from "lucide-react";
import { Meteor } from "meteor/meteor";

import { api } from "../api";
import { AppSidebar } from "../components/AppSidebar";
import { CreateTeamDialog } from "../components/CreateTeamDialog";
import { SidebarProvider, SidebarTrigger } from "../elements/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../elements/table";

export const Teams = () => {
  const userId = Meteor.userId();
  if (!userId) return <p>You must be logged in to continue</p>;

  const { data: teams = [], isLoading, error } = api.teams.getUserTeams.useQuery({ _id: userId });

  if (error) return <p>Error loading teams: {error.message}</p>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-col h-screen w-full">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold pb-4 pl-14 pt-7 border-b border-gray-300 w-full">
          Your Teams <Users className="inline pb-1 ml-1" />
        </h1>
        <div className="flex-col max-w-5xl mx-auto p-6">
          {teams?.length ? (
            <ul className="space-y-4">
              {isLoading ? (
                <p>Loading teams...</p>
              ) : (
                teams.map((team) => (
                  <div key={team._id} className="border border-gray-300 p-6 bg-slate-50 shadow-md">
                    <h2 className="text-xl font-bold mb-2">{team.name}</h2>
                    <Table className="mb-4">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Joined At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {team.members.length > 0 ? (
                          team.members.map((member) => (
                            <TableRow key={member?._id}>
                              <TableCell>
                                {member?.profile?.name ||
                                  member?.services?.github?.name ||
                                  member?.services?.google?.name}
                              </TableCell>
                              <TableCell>
                                {member?.emails?.[0]?.address ||
                                  member?.services?.github?.email ||
                                  member?.services?.google?.email}
                              </TableCell>
                              <TableCell>
                                {member?.createdAt
                                  ? new Date(member.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">
                              No members in this team
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ))
              )}
            </ul>
          ) : (
            <p className="text-gray-500">You have no teams yet.</p>
          )}
          <div className="flex justify-end mt-4">
            <CreateTeamDialog />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

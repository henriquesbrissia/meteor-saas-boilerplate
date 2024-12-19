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

  const { data: teams = [], isLoading } = api.teams.getUserTeams.useQuery({ _id: userId });

  if (error) return <p>Error loading teams: {error.message}</p>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className="container mx-auto p-6">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Your Teams</CardTitle>
          </CardHeader>
          <CardContent>
            {teams?.length ? (
              <ul className="space-y-4">
                {isLoading ? (
                  <p>Loading teams...</p>
                ) : (
                  teams.map((team) => (
                    <div key={team._id} className="border rounded-lg p-4 my-4 shadow">
                      <h2 className="text-xl font-bold mb-2">{team.name}</h2>
                      <Table className="mb-4">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Sign up</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {team.members.length > 0 ? (
                            team.members.map((member) => (
                              <TableRow key={member._id}>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>
                                  {team.members[0].createdAt
                                    ? new Date(team.members[0].createdAt).toLocaleDateString()
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

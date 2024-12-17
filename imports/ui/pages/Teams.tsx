import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Meteor } from "meteor/meteor";
import { useForm } from "react-hook-form";

import type { CreateTeamValues } from "/imports/api/teams/schemas";
import { createTeamSchema } from "/imports/api/teams/schemas";

import { api } from "../api";
import { AppSidebar } from "../components/AppSidebar";
import { Button } from "../elements/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../elements/card";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "../elements/form";
import { Input } from "../elements/input";
import { SidebarProvider, SidebarTrigger } from "../elements/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../elements/table";

export const Teams = () => {
  const form = useForm<CreateTeamValues>({
    defaultValues: { name: "" },
    resolver: zodResolver(createTeamSchema)
  });

  const queryClient = useQueryClient();

  const userId = Meteor.userId();
  if (!userId) return <p>You must be logged in to continue</p>;

  const { data: teams = [], isLoading } = api.teams.getUserTeams.useQuery({ _id: userId });

  const createTeam = api.teams.createTeam.useMutation({
    onError: (error) => console.error("Error creating team:", error),
    onSuccess: async () => {
      alert("Team created successfully!");
      form.reset();
      await queryClient.invalidateQueries();
    }
  });

  const handleCreateTeam = async (data: CreateTeamValues) => {
    try {
      await createTeam.mutateAsync(data);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Create New Team</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateTeam)}>
              <CardContent>
                <FormItem>
                  <FormLabel>Team name</FormLabel>
                  <FormControl>
                    <Input
                      id="teamName"
                      type="text"
                      placeholder="Enter team name"
                      {...form.register("name")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" variant="default">
                  Create Team
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </SidebarProvider>
  );
};

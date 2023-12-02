import SearchBar from "@/components/search-bar";
import UserCard from "@/components/user-card";
import { getSearchParam } from "@/lib/auth.server";
import prisma from "@/lib/prismadb";
import { UserSearchSchema } from "@/lib/user-validation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { z } from "zod";

const UserSearchResultsSchema = z.array(UserSearchSchema);

const getUsers = async (searchTerm: string | null) => {
  if (searchTerm) {
    const like = `%${searchTerm}%`;
    return prisma.$queryRaw`
  SELECT User.id,  User.username, User.name, User.email, UserImage.id as imageId
  FROM User
  LEFT JOIN UserImage ON UserImage.userId = User.id
  WHERE User.username LIKE ${like}
  OR User.name LIKE ${like}
  ORDER BY User.created_at DESC
  LIMIT 50
  `;
  } else {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        image: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
};

export const revalidate = 0;
export default async function Home() {
  const searchParams = getSearchParam("search");

  const fetchUsers = await getUsers(searchParams);
  const validatedUsers = UserSearchResultsSchema.safeParse(fetchUsers);
  if (!validatedUsers.success) {
    throw toast.error("An error occurred while fetching users.");
  }

  const users = validatedUsers.data;

  return (
    <main className="pt-24 h-[100%]">
      <div className="container mb-48 mt-36 flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl">Bloomflow Users</h1>
        <div className="w-full max-w-[700px]">
          <SearchBar autoFocus autoSubmit />
        </div>
      </div>
      <ul
        className={cn(
          "flex w-full flex-wrap items-center justify-center gap-4 delay-200"
        )}
      >
        {users.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl">No users found</h1>
          </div>
        )}

        {users.map((user) => (
          <UserCard
            key={user.id}
            email={user.email}
            id={user.id}
            username={user.username}
            imageId={user.image?.id ?? null}
            name={user.name}
          />
        ))}
      </ul>
    </main>
  );
}

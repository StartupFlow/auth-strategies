"use server";

import { revalidate } from "@/app/page";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const UsersSearchAction = async (formData: FormData) => {
  const searchTerm = formData.get("search");
  if (!searchTerm) {
    redirect("/");
  }

  const searchParams = new URLSearchParams();
  searchParams.append("search", searchTerm as string);

  const searchUrl = ["/", searchParams.toString()].join("?");
  revalidatePath(searchUrl);
  redirect(searchUrl);
};

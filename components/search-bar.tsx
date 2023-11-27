"use client";

import { UsersSearchAction } from "@/actions/search/users-search.actions";
import { useDebounce } from "@/hooks/use-debounce";
import { GlassesIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useId } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { StatusButton } from "./ui/status-button";

type SearchBarProps = {
  autoFocus?: boolean;
  autoSubmit?: boolean;
};
const SearchBar = ({
  autoFocus = false,
  autoSubmit = false,
}: SearchBarProps) => {
  const searchParams = useSearchParams();
  const id = useId();

  const handleFormChange = useDebounce((form: HTMLFormElement) => {
    form.requestSubmit();
  }, 400);

  return (
    <form
      action={UsersSearchAction}
      onChange={(e) => {
        if (autoSubmit) {
          handleFormChange(e.currentTarget);
        }
      }}
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <div className="flex-1">
        <Label htmlFor={id} className="sr-only">
          Search a user
        </Label>
        <Input
          type="search"
          id={id}
          name="search"
          defaultValue={searchParams.get("search") ?? ""}
          placeholder="Search a user"
          className="w-full"
          autoFocus={autoFocus}
        />
      </div>
      <div>
        <StatusButton
          type="submit"
          className="flew w-full items-center justify-center h-[2.6rem]"
          size={"sm"}
        >
          <GlassesIcon className="h-34" />
          <span className="sr-only">Search</span>
        </StatusButton>
      </div>
    </form>
  );
};

export default SearchBar;

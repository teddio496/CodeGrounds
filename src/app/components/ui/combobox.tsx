"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/src/app/components/ui/button";
import Avatar from "@/src/app/components/Avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/app/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/app/components/ui/popover";
export function ComboboxDemo({
  tags,
  onTagSelect,
  object,
}: {
  tags: { value: string; label: string, img: any}[];
  onTagSelect: (tag: string) => void;
  object: string
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between z-40 light:border-black"
        >
          {value
            ? tags.find((tag) => tag.value === value)?.label
            : `Select ${object}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 z-40 dark:bg-[#222222] dark:text-white text-black bg-gray-100">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No {object} found.</CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.value}
                  value={tag.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onTagSelect(currentValue); // Trigger the callback
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === tag.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {typeof tag.img === "string" && (
                    <img
                    src={tag.img || "/uploads/avatar.jpg"}
                    className="w-6 h-6 rounded-full cursor-pointer"
                  />
                  )}
                  {tag.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

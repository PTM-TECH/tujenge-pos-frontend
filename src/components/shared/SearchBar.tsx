"use client";

import { Search } from "lucide-react";
import { Input, type InputProps } from "@/components/ui/Input";

export function SearchBar(props: Omit<InputProps, "leftIcon">) {
  return <Input leftIcon={<Search className="h-4 w-4" />} type="search" {...props} />;
}
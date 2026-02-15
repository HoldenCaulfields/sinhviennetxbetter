import { CATEGORIES } from "@/constants";

/**
 * map m1 -> music
 */
export const OPTION_TO_CATEGORY = Object.fromEntries(
  CATEGORIES.flatMap(category =>
    category.subOptions.map(opt => [opt.id, category.id])
  )
);

export function userMatchesFilter(user: any, activeFilter: string) {
  if (activeFilter === "all") return true;

  return user.selectedOptions?.some(
    (opt: string) => OPTION_TO_CATEGORY[opt] === activeFilter
  );
}

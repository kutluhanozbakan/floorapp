// Minimal className combiner — joins truthy class strings with a space.
// Keeps component class composition readable without pulling in a dependency.
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

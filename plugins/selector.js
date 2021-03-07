import HealthCheck from "./health-check/HealthCheck";

export function selectPlugin(items) {
  switch (items) {
    case "health-check":
      return HealthCheck;
    default:
      console.error(`${items} plugin not found.`);
  }
}
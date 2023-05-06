import { useRoute } from "vue-router";

export const useId = (): string => {
  let route = useRoute();
  return route.params.id ? route.params.id.toString() : "";
};

export const useRouteParams = () => {
  let route = useRoute();
  return route.params;
};

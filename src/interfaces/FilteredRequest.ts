export interface FilteredRequestParams {
  formId: string;
}

export type FilterClauseType = {
  id: string;
  condition: "equals" | "does_not_equal" | "greater_than" | "less_than";
  value: number | string;
};

// The following ceremony is needed only so we can reuse
// the list of original API keys for runtime validation later.
export const origAPIqueryParamKeys = [
  "limit",
  "afterDate",
  "beforeDate",
  "offset",
  "status",
  "includeEditLink",
  "sort",
];

// derives a union type from the list of keys
type OrigAPIqueryParamKeys = (typeof origAPIqueryParamKeys)[number];

export type OriginAPIQueryParams = {
  [K in OrigAPIqueryParamKeys]?: string;
};

type Filters = {
  filters?: FilterClauseType[];
}

export type FilteredQueryParams = OriginAPIQueryParams & Filters;

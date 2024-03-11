export interface FilteredRequestParams {
  formId: string;
}

export type FilterClauseType = {
  id: string;
  condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than';
  value: number | string;
}

export interface FilteredQueryParams {
  filters?: FilterClauseType[];
  limit?: string;
  afterDate?: string;
  beforeDate?: string;
  offset?: string;
  status?: string;
  includeEditLink?: string;
  sort?: string;
}

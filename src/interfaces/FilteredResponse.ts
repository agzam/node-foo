import { Request, Response } from 'express';
import { FilteredRequestParams, FilteredQueryParams } from './interfaces/FilteredRequest';

interface Option {
  id: string;
  value: string;
  label: string;
}

export interface Question {
  id: string;
  name: string;
  type: "LongAnswer"|"ShortAnswer"|"DatePicker"|"NumberInput"|"MultipleChoice"|"EmailInput";
  options?: Option[];
  value: string;
}

export interface FilteredResponseData {
  id: string;
  name: string;
  questions: Question[];
  calculations: any[];
  urlParameters: any[];
  documents: any[];
}

export interface FilteredResponse {
  error?: string;
  message?: string;
  data?: FilteredResponseData[];
  totalResponses?: number;
  pageCount?: number;
}

export type FilteredResponseHandler = (
  req: Request<FilteredRequestParams, FilteredResponse, any, FilteredQueryParams>,
  res: Response<FilteredResponse>
) => Promise<void>;

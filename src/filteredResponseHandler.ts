import axios from "axios";

import {
  Question,
  FilteredResponseData,
  FilteredResponseHandler,
} from "./interfaces/FilteredResponse";

import {
  origAPIqueryParamKeys,
  OriginAPIQueryParams,
} from "./interfaces/FilteredRequest";

import { filterQuestions } from "./filterQuestions";

const pageSize = 100;

function sanitizeQueryParams(query: any): OriginAPIQueryParams {
  let sanitized: OriginAPIQueryParams = {};

  for (let key in query) {
    if (origAPIqueryParamKeys.includes(key)) {
      sanitized[key as keyof OriginAPIQueryParams] = query[key];
    }
  }
  return sanitized;
}

export const handler: FilteredResponseHandler = async (req, res) => {
  let baseUrl = `https://api.fillout.com/v1/api/forms/${req.params.formId}`;

  try {
    const resp = await axios.get(baseUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      params: sanitizeQueryParams(req.query), // passing the query params through
    });

    let data = resp.data;

    data.questions = filterQuestions(data.questions, req.query.filters);

    // Pagination related calculations
    const totalResponses = data.questions.length;
    // console.log(totalResponses)
    const pageCount = Math.ceil(totalResponses / pageSize);

    res.json({ data: data, totalResponses, pageCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error occurred while fetching data" });
  }
};

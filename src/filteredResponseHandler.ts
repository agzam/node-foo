import axios from "axios";

import {
  Question,
  FilteredResponseData,
  FilteredResponseHandler,
} from "./interfaces/FilteredResponse";

import { FilterClauseType } from "./interfaces/FilteredRequest";

const pageSize = 100;

type FilterFunction = (item: Question, value: string | number) => boolean;

const filterFunctions: Record<FilterClauseType["condition"], FilterFunction> = {
  equals: (item: Question, value: string | number) => item.value === value,
  does_not_equal: (item: Question, value: string | number) => item.value !== value,
  greater_than: (item: Question, value: string | number) => false, //item.value > value,
  less_than: (item: Question, value: string | number) => false, //item.value < value,
};

export const handler: FilteredResponseHandler = async (req, res) => {
  let baseUrl = `https://api.fillout.com/v1/api/forms/${req.params.formId}`;

  try {
    const resp = await axios.get(baseUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      params: req.query, // passing through the query params
    });

    let data = resp.data;

    // for (let filter of req.query.filters) {
    //   const filterFunc = filterFunctions[filter.condition as keyof typeof filterFunctions];
    //   if (filterFunc) {
    //     data.questions = filter((item: Question) =>
    //       item.id === filter.id && filterFunc(item, filter.value)
    //     );
    //   }
    // }

    // Pagination related calculations
    const totalResponses = data.questions.length;
    const pageCount = Math.ceil(totalResponses / pageSize);

    res.json({ data: data, totalResponses, pageCount });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error occurred while fetching data" });
  }
};

import { Question } from "./interfaces/FilteredResponse";
import { FilterClauseType } from "./interfaces/FilteredRequest";

type FilteringValue = string | number | Date;

const filterFunctions = {
  equals: (itemVal: FilteringValue, filterVal: FilteringValue) =>
    itemVal === filterVal,
  does_not_equal: (itemVal: FilteringValue, filterVal: FilteringValue) =>
    itemVal !== filterVal,
  less_than: (itemVal: FilteringValue, filterVal: FilteringValue) =>
    itemVal < filterVal,
  greater_than: (itemVal: FilteringValue, filterVal: FilteringValue) =>
    itemVal > filterVal,
};

export function filterQuestions(
  questions: Array<Question>,
  filtersStr: string,
): any {
  try {
    const filters = JSON.parse(filtersStr);
    if (!filters || filters.length === 0) {
      return questions;
    }

    // will traverse through the questions
    // for each question, passing through the filters
    // matching a filter function based on conditions - equals, less_than, etc
    // only numbers and dates need to be parsed
    // everything else gets compared lexicographically
    return questions.reduce((acc: Question[], nxt: Question) => {
      let shouldInclude = false;
      for (let flt of filters) {
        if (flt.id !== nxt.id) {
          break;
        }
        const filterFn =
          filterFunctions[flt.condition as keyof typeof filterFunctions];
        let questionVal = nxt.value;
        switch (nxt.type) {
          case "NumberInput": {
            const itemVal = parseInt(questionVal),
              filterVal = parseInt(flt.value);
            if (Number.isInteger(itemVal) && Number.isInteger(filterVal)) {
              shouldInclude = filterFn(itemVal, filterVal);
            }
            break;
          }
          case "DatePicker": {
            const itemVal = new Date(questionVal),
              filterVal = new Date(flt.value);
            shouldInclude = filterFn(itemVal, filterVal);
            break;
          }
          default:
            shouldInclude = filterFn(questionVal, flt.value);
        }
        if (shouldInclude) {
          acc.push(nxt);
        }
      }
      return acc;
    }, []);
  } catch (err) {
    return questions;
  }
}

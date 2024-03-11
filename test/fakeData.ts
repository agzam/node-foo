import { faker } from "@faker-js/faker";

interface Option {
  id: string;
  value: string;
  label: string;
}

interface Question {
  id: string;
  name: string;
  type: string;
  value: string;
  options?: Option[];
}

interface Data {
  id: string;
  name: string;
  questions: Question[];
  calculations: any[];
  urlParameters: any[];
  documents: any[];
}

interface FakeData {
  data: Data;
  totalResponses: number;
  pageCount: number;
}

const types: string[] = [
  "LongAnswer",
  "ShortAnswer",
  "DatePicker",
  "NumberInput",
  "MultipleChoice",
  "EmailInput",
];

const generateOptions = (): Option[] =>
  Array.from({ length: 3 }, (_) => ({
    id: faker.string.uuid(),
    value: faker.commerce.department(),
    label: faker.commerce.department(),
  }));

export function generateQuestions(count = 1000): Question[] {
  return Array.from({ length: count }, (_) => {
    const type = types[Math.floor(Math.random() * types.length)];
    let value;
    switch (type) {
      case "ShortAnswer":
      case "LongAnswer":
        value = faker.word.sample();
        break;
      case "EmailInput":
        value = faker.internet.email();
        break;
      case "NumberInput":
        value = faker.number.int().toString();
        break;
      case "DatePicker":
        value = faker.date.recent().toISOString();
        break;
      default:
        value = faker.word.sample();
    }

    const question: Question = {
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
      type: type,
      value: value,
    };
    if (type === "MultipleChoice") {
      question.options = generateOptions();
    }
    return question;
  });
}

function generateFilterForQuestion(question: Question) {
  let value, condition;
  switch (question.type) {
    case "ShortAnswer":
    case "LongAnswer":
    case "EmailInput":
      value = question.value;
      condition = faker.helpers.arrayElement(["equals", "does_not_equal"]);
      break;
    case "DatePicker":
      condition = faker.helpers.arrayElement(["greater_than", "less_than"]);
      let params = { refDate: question.value };
      let dt =
        condition === "less_than"
          ? faker.date.past(params)
          : faker.date.future(params);
      value = dt.toISOString();
      break;
    case "NumberInput":
      condition = faker.helpers.arrayElement(["greater_than", "less_than"]);
      let nb =
        condition === "less_than"
          ? faker.number.int({ max: parseInt(question.value) })
          : faker.number.int({ min: parseInt(question.value) });
      value = nb;
      break;
    // case 'MultipleChoice':
    //   break;
  }
  return {
    id: question.id,
    condition: condition,
    value: value,
  };
}

// Generates random filters for given questions
export function generateFakeFilterClauses(questions: Question[]) {
  let someQuestions = faker.helpers.arrayElements(questions, 10);
  return someQuestions.map(generateFilterForQuestion).filter((x) => x.value);
}

export function generateData(count = 1000): FakeData {
  const questions = generateQuestions(count);
  return {
    data: {
      id: faker.string.uuid(),
      name: "Test Data",
      questions: questions,
      calculations: [],
      urlParameters: [],
      documents: [],
    },
    totalResponses: questions.length,
    pageCount: Math.ceil(questions.length / 100),
  };
}

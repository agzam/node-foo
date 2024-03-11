import { faker } from '@faker-js/faker';

interface Option {
  id: string;
  value: string;
  label: string;
}

interface Question {
  id: string;
  name: string;
  type: string;
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
  'LongAnswer',
  'ShortAnswer',
  'DatePicker',
  'NumberInput',
  'MultipleChoice',
  'EmailInput',
];

const generateOptions = (): Option[] =>
  Array.from({ length: 3 }, (_) => ({
    id: faker.string.uuid(),
    value: faker.commerce.department(),
    label: faker.commerce.department(),
  }));

export function generateQuestions(count = 1000): Question[] {
  return Array.from({ length: count }, (_) => {
    const type = types[Math.floor(Math.random() * types.length)]
    const question: Question = {
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
      type: type,
    }
    if (type === "MultipleChoice") {
      question.options = generateOptions()
    }
    return question
  })
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
  }
}

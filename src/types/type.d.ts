type Data = {
  _id?: any;
  id?: string;
  Title: string;
  Image?: string;
  Pembuat: string;
  Diedit?: string;
  Link: string;
  Waktu?: string;
  Edit?: string;
  Content:
    | {
        babTitle: string;
        babContent: string;
      }[]
    | string;
};

type userType = {
  _id?: any;
  id?: string;
  username: string;
  password?: string;
  desc?: string;
  atmin?: boolean;
  accessToken?: {
    accessNow: string;
    timeBefore: string;
  };
  quizScore?: number;
};

type quizType = {
  _id?: any;
  soal: string;
  image?: string;
  multipleQuestion: {
    jawaban: string;
    answer: boolean;
    score: number;
  }[];
};

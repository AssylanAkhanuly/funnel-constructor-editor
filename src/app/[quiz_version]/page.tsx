import { listQuizPages } from "@/widgets/quiz/actions";
import QuizPagesList from "@/widgets/quiz/ui/quiz-pages-list";

const page = async (props: { params: Promise<{ quiz_version: string }> }) => {
  const params = await props.params;
  const quizVersion = params.quiz_version;
  const pages = await listQuizPages(quizVersion);
  return <QuizPagesList pages={pages} quizVersion={quizVersion} />;
};

export default page;

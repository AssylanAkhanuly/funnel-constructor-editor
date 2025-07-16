import { listQuizVersions } from "@/widgets/quiz/actions";
import QuizVersionsList from "@/widgets/quiz/ui/quiz-versions-list";

const page = async () => {
  const quizVersions = await listQuizVersions();
  return <QuizVersionsList quizVersions={quizVersions} />;
};

export default page;

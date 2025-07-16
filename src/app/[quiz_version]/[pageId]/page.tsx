import Constructor from "@/widgets/page-editor/ui/constructor";
import { getPage } from "@/widgets/quiz/actions";

const page = async (props: {
  params: Promise<{ pageId: string; quiz_version: string }>;
}) => {
  const params = await props.params;
  const page = await getPage(params.quiz_version, params.pageId);

  return (
    <Constructor
      page={page}
      pageId={params.pageId}
      quizVersion={params.quiz_version}
    />
  );
};

export default page;

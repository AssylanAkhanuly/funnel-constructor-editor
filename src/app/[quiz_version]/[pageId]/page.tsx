import { listFilesInFolder } from "@/shared/lib/s3";
import Constructor from "@/widgets/page-editor/ui/Constructor";

const page = async () => {
  const pages = await listFilesInFolder();

  return <Constructor />;
};

export default page;

import Image from "next/image";

const Media = (props: { src: string }) => {
  return <Image width={500} height={500} src={props.src} alt="image" />;
};

export default Media;

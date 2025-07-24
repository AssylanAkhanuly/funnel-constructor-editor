import { JsxEditorProps } from "@mdxeditor/editor";

 export const getAttributeValue = (props: JsxEditorProps, name: string): string => {
    const attr = props.mdastNode.attributes?.find(
      (attr) => "name" in attr && attr.name === name
    );
    if (attr && "value" in attr && typeof attr.value === "string") {
      return attr.value;
    }
    return "";
  };
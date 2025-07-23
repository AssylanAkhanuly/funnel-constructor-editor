import {
  realmPlugin
} from "@mdxeditor/editor";

const specificTag = "CustomTag"; // Replace with the tag you want to target

export const devicePlugin = realmPlugin({
  init(r) {
    console.log("asdfasdf")
  },
  update(r) {},
});

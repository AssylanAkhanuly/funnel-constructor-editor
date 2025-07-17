export const tryParse = (jsonStr: any) => {
  try {
    const json = JSON.parse(jsonStr);
    return json;
  } catch (e) {
    return;
  }
};

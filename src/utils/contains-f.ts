export const containsF = (text: string): boolean => {
  const regex = /^[fFфФ]+$/;

  return regex.test(text);
};

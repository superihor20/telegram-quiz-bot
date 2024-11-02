export const formatAnswerText = (count: number, falsy = false) => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return `${count} ${falsy ? 'не' : ''}правильна`;
  } else if (
    [2, 3, 4].includes(count % 10) &&
    ![12, 13, 14].includes(count % 100)
  ) {
    return `${count} ${falsy ? 'не' : ''}правильні`;
  } else {
    return `${count} ${falsy ? 'не' : ''}правильних`;
  }
};

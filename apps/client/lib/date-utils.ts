export const getMinutes = (time: string) => {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const getDuration = (openingTime: string, closingTime: string) => {
  if (!openingTime || !closingTime)
    throw new Error("Opening and closing time are required");

  const openingMinutes = getMinutes(openingTime);
  const closingMinutes = getMinutes(closingTime);

  return {
    openingTime: openingMinutes,
    closingTime: closingMinutes,
  };
};

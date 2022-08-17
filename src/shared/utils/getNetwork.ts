const getNetwork = (): string => {
  return process.env.NEXT_PUBLIC_NETWORK ?? "";
};

export default getNetwork;

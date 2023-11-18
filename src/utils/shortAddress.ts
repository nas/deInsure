export const shortAddressLabel = (address: string) => {
  if (address) {
    const firstPart = address.slice(0, 8);
    const lastPart = address.slice(address.length - 8);

    return `${firstPart}...${lastPart}`;
  }

  return address;
};

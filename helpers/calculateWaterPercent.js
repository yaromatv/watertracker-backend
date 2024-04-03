const calculateWaterPercent = (totalUse, norm) => {
  return (totalUse * 100) / norm || null;
};

export default calculateWaterPercent;

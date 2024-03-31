const calculateWaterPercent = (totalUse, norma) => {
  return (totalUse * 100) / norma || null;
};

export default calculateWaterPercent;

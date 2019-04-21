function depreciation(capitalizedCost, residualValue, months) {
  return (capitalizedCost - residualValue) / months;
}

function financeCharge(capitalizedCost, residualValue, moneyFactor) {
  return (capitalizedCost + residualValue) * moneyFactor;
}

function moneyFactor(apr) {
  return apr / 2400;
}

function calcResidualValue(msrp, residualPercent) {
  return msrp * residualPercent;
}

function payment(msrp, capitalizedCost, residualPercent, months, apr) {
  var mf = moneyFactor(apr);
  var residualValue = calcResidualValue(msrp, residualPercent);
  return (
    depreciation(capitalizedCost, residualValue, months) +
    financeCharge(capitalizedCost, residualValue, mf)
  );
}

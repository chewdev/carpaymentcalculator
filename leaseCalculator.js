class leaseCalculator {
  constructor() {
    this.form = document.querySelector("#payment-form");
    this.msrp = document.querySelector("#msrp");
    this.capcost = document.querySelector("#capcost");
    this.residualpercent = document.querySelector("#residualpercent");
    this.months = document.querySelector("#months");
    this.apr = document.querySelector("#apr");
    this.currValues = {
      msrp: "",
      capcost: "",
      residualpercent: "",
      months: "",
      apr: ""
    };
    this.events();
  }

  events() {
    var that = this;
    [
      this.msrp,
      this.capcost,
      this.residualpercent,
      this.months,
      this.apr
    ].forEach(function(input) {
      input.oninput = that.validateAndUpdate.bind(that);
    });
    this.form.onsubmit = this.onFormSubmit;
  }

  onFormSubmit(e) {
    e.preventDefault();
    return false;
  }

  validateAndUpdate(e) {
    var currValue = e.target.value;
    var currAttr = e.target.getAttribute("id");

    if (!/^\d*([.]\d?\d?)?$/gm.test(currValue)) {
      // If new value is not a valid number, set input back to its previous value (don't update to new value)
      e.target.value = this.currValues[currAttr];
      return;
    }

    // If new value is a valid number, set currValue to new number string
    this.currValues[currAttr] = currValue;

    // Check that all inputs are valid numbers
    var that = this;
    var allValid = Object.keys(this.currValues).every(function(key) {
      return !isNaN(Number.parseFloat(that.currValues[key]));
    });

    // If all inputs are valid, get payment and update
    if (allValid) {
      this.getPayment();
    }
    // If not all inputs are valid, reset displayed payment estimate to N/A
    else {
      document.querySelector(".payment-estimate").innerHTML = `N/A`;
    }
  }

  depreciation(capitalizedCost, residualValue, months) {
    return (capitalizedCost - residualValue) / months;
  }

  financeCharge(capitalizedCost, residualValue, moneyFactor) {
    return (capitalizedCost + residualValue) * moneyFactor;
  }

  moneyFactor(apr) {
    return apr / 2400;
  }

  calcResidualValue(msrp, residualPercent) {
    return (msrp * residualPercent) / 100;
  }

  payment(msrp, capitalizedCost, residualPercent, months, apr) {
    var mf = this.moneyFactor(apr);
    var residualValue = this.calcResidualValue(msrp, residualPercent);
    return (
      this.depreciation(capitalizedCost, residualValue, months) +
      this.financeCharge(capitalizedCost, residualValue, mf)
    );
  }

  // only call getPayment if all this.currValues are valid number strings
  getPayment() {
    var { msrp, capcost, residualpercent, months, apr } = this.currValues;
    [msrp, capcost, residualpercent, months, apr] = [
      msrp,
      capcost,
      residualpercent,
      months,
      apr
    ].map(function(val) {
      return Number.parseFloat(val);
    });

    var cost = this.payment(msrp, capcost, residualpercent, months, apr);
    cost = cost.toFixed(0);

    // Update monthly payment display to new cost
    document.querySelector(".payment-estimate").innerHTML = `$${cost} / mo.`;
  }
}

var leaseCalc = new leaseCalculator();

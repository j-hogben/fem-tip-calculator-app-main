const calculatorForm = document.getElementById('calculatorForm');
const tipPerPerson = document.getElementById('tipPerPerson');
const totalPerPerson = document.getElementById('totalPerPerson');
const resetButton = document.getElementById('resetButton');

let calcData = {
  bill: '',
  tip: '',
  numOfPeople: '',
};

// ////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ TIP CALCULATOR ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

const calculate = () => {
  // FUNCTION TO GET INPUT VALUE BY ID
  const getValue = (id, defValue = '') => parseFloat(document.getElementById(id).value) || defValue;

  // FUNCTION TO GET INPUT VALUE BY SELECTED RADIO BUTTON
  const getRadioValue = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value;

  // FUNCTION TO CALCULATE TIP PER PERSON
  const tipCalc = () =>
    calcData.tip ? (calcData.bill * calcData.tip) / 100 / calcData.numOfPeople : 0;

  // FUNCTION TO CALCULATE TOTAL PER PERSON
  const totalCalc = () => parseFloat(tipCalc() + calcData.bill / calcData.numOfPeople);

  // ~ ~ ~ ~ ~

  // UPDATE calcData
  calcData = {
    bill: getValue('bill'),
    tip: getValue('customTip') || getRadioValue('tip') || '',
    numOfPeople: getValue('numOfPeople'),
  };

  // WHEN BILL AND NUMOFPEOPLE HAVE VALUES, UPDATE RESULTS SCREEN
  if (calcData.bill && calcData.numOfPeople) {
    tipPerPerson.textContent = `$${tipCalc().toFixed(2)}`;
    totalPerPerson.textContent = `$${totalCalc().toFixed(2)}`;
  } else {
    tipPerPerson.textContent = '$0.00';
    totalPerPerson.textContent = '$0.00';
  }
};

// ////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ CUSTOM INPUT RULES ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

document.addEventListener('DOMContentLoaded', () => {
  const customRadio = document.getElementById('customTipRadio');
  const customTip = document.getElementById('customTip');
  const otherRadios = document.querySelectorAll('.staticTipRadio');
  const numbersToFormat = document.querySelectorAll('[data-number-format]');

  numbersToFormat.forEach((number) => {
    // PREVENT EDGE CASES THAT INPUT OF TYPE 'NUMBER' ALLOWS
    number.addEventListener('keydown', (e) => {
      const invalidKeys = ['e', 'E', '-', '+'];
      if (invalidKeys.includes(e.key)) {
        e.preventDefault();
      }
    });

    // DO NOT LET THE INPUT VALUE EXCEED THE HTML MAX VALUE
    number.addEventListener('input', (e) => {
      const maxValue = e.target.max ? parseFloat(e.target.max) : 9999;
      if (e.target.value > maxValue) {
        e.target.value = maxValue;
      }
    });

    // MAKE DECIMAL INPUTS TWO DECIMAL PLACES
    number.addEventListener('blur', (e) => {
      if (e.target.value && e.target.getAttribute('inputmode') === 'decimal') {
        e.target.value = parseFloat(e.target.value).toFixed(2);
      }
    });
  });

  // FOCUS ON CUSTOM AMOUNT WHEN CUSTOM RADIO IS CHECKED
  customRadio.addEventListener('change', () => customTip.focus());

  // RESET CUSTOM AMOUNT IF OTHER RADIO BUTTON AMOUNT IS CHECKED
  otherRadios.forEach((button) => {
    button.addEventListener('change', () => {
      customTip.value = '';
    });
  });

  // IF CUSTOM AMOUNT IS EMPTY WHEN NAVIGATED AWAY FROM, HIDE TEXT INPUT
  customTip.addEventListener('blur', () => {
    if (customTip.value === '') {
      customRadio.checked = false;
    }
  });
});

// ////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ RESET BUTTON ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

const resetForm = () => {
  calculatorForm.reset();
  tipPerPerson.textContent = '$0.00';
  totalPerPerson.textContent = '$0.00';
  calcData = {
    bill: '',
    tip: '',
    numOfPeople: '',
  };
};

// EXECUTE ON CLICK
resetButton.addEventListener('click', () => resetForm());

// ////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ FORM VALIDATION ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

const validateForm = (formToValidate) => {
  const formGroups = formToValidate.querySelectorAll('.formGroup');

  // INITIALISE ERROR COUNT
  let formErrorCount = 0;

  // VALIDATION OPTIONS TO LOOP THROUGH FOR EACH FORMGROUP
  const validationOptions = [
    {
      attribute: 'required',
      isValid: (input) => input.value.trim() !== '',
      errorMessage: "Can't be zero",
    },
  ];

  // VALIDATE A SINGLE FORM GROUP
  const validateSingleFormGroup = (formGroup) => {
    const input = formGroup.querySelector('input');
    const errorContainer = formGroup.querySelector('.error');

    for (const option of validationOptions) {
      if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
        errorContainer.textContent = option.errorMessage;
        formErrorCount++;
      } else {
        errorContainer.textContent = '';
      }
    }
  };

  // WHEN A FORMGROUP INPUT IS NAVIGATED AWAY FROM, RUN VALIDATION
  formGroups.forEach((formGroup) => {
    const formGroupInput = formGroup.querySelector('input');

    formGroupInput.addEventListener('blur', () => {
      validateSingleFormGroup(formGroup);
    });
  });

  // IF FORMERROR COUNT IS 0, RETURN TRUE, ELSE RETURN FALSE
  return formErrorCount === 0;
};

// ////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ EXECUTE ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

// ONCE FORM VALIDATION IS SUCCESSFUL, RUN CALCULATE FUNCTION ON EACH FORM INPUT
if (validateForm(calculatorForm)) {
  calculatorForm.addEventListener('input', () => {
    calculate();
  });
}

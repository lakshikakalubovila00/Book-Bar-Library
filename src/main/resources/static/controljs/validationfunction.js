
// validation function
// define function for text element validate
const textElementValidator = (element, pattern, object, property) => {
  const elementValue = element.value;
  const regPattern = new RegExp(pattern);
  const ob = window[object];

  if (elementValue != "") {
    // value not empty
    if (regPattern.test(elementValue)) {
      //valid value
      element.style.borderBottom = "2px solid lightgreen";
      // element.style.backgroundColor="lightgreen";
      ob[property] = elementValue;
    } else {
      //invalid value
      // element.style.backgroundColor="pink";
      element.style.borderBottom = "2px solid pink";
      ob[property] = null;
    }
  } else {
    // value empty
    if (element.required) {
      //invalid value
      // element.style.backgroundColor="pink";
      element.style.borderBottom = " 2px solid pink";
      ob[property] = null;
    } else {
      //defalt
      
      element.style.borderBottom="white";
    }
  }
};



export function downloadJson (jsonObject: object, fileName: string) {
  const sJson = JSON.stringify (jsonObject);
  const element = document.createElement ("a");
  element.setAttribute (
    "href",
    "data:text/json;charset=UTF-8," + encodeURIComponent (sJson)
  );
  element.setAttribute ("download", fileName);
  element.style.display = "none";
  document.body.appendChild (element);
  element.click ();
  document.body.removeChild (element);
} // downloadJson

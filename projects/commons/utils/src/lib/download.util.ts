export function downloadJson(jsonObject: object, fileName: string): void {
  const sJson = JSON.stringify(jsonObject);
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson),
  );
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.append(element);
  element.click();
  element.remove();
}

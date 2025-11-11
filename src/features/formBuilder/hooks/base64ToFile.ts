export const base64ToFile = (
  base64String: string,
  filename = "image.png",
  type = "image/png"
) => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || type;
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
  return new File([u8arr], filename, { type: mime });
};

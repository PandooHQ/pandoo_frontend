import api from "@/shared/api/api";

export const base64ToFile = (base64String: string, filename = "image.png", type = "image/png") => {
  const arr = base64String.split(",");
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
  return new File([u8arr], filename, { type });
};

export const createForm = async (data: any) => {
  const formData = new FormData();
  const form = data.form;

  if (form.id) formData.append("form[id]", form.id.toString());
  formData.append("form[title]", form.title || "");
  formData.append("form[description]", form.description || "");

  Object.entries(form.steps_attributes || {}).forEach(([stepIndex, step]: any) => {
    const stepKey = `form[steps_attributes][${stepIndex}]`;
    formData.append(`${stepKey}[title]`, step.title || "");
    formData.append(`${stepKey}[position]`, step.position?.toString() || "1");

    Object.entries(step.inputs_attributes || {}).forEach(([inputIndex, input]: any) => {
      const inputKey = `${stepKey}[inputs_attributes][${inputIndex}]`;

      formData.append(`${inputKey}[label]`, input.label || "");
      formData.append(`${inputKey}[name]`, input.name || "");
      formData.append(`${inputKey}[position]`, input.position?.toString() || "1");
      formData.append(`${inputKey}[input_config_type]`, input.input_config_type || "");

      const attrs = input.input_config_attributes || {};
      formData.append(`${inputKey}[input_config_attributes][required]`, attrs.required ? "true" : "false");
      if (attrs.description)
        formData.append(`${inputKey}[input_config_attributes][description]`, attrs.description);

      if (input.image_data?.filename?.startsWith("data:")) {
        try {
          const file = base64ToFile(
            input.image_data.filename,
            `step-${stepIndex}-input-${inputIndex}.png`,
            input.image_data.content_type || "image/png"
          );

          formData.append(`${inputKey}[image_data]`, file);
        } catch (err) {
          console.error("❌ Error al convertir base64 a File:", err);
        }
      }
    });
  });

  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  // Enviar al backend
  return await api.post("/admin/forms", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

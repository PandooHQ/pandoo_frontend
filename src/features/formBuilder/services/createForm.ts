import type { Form } from "@/features/forms/types/FormNormalized";
import api from "@/shared/api/api";
import { base64ToFile } from "../hooks/base64ToFile";

export interface FormCreateResponse {
  form: Form;
}

const appendFormData = (formData: FormData, data: Form, parentKey = "") => {
  if (data === null || data === undefined) return;

  if (Array.isArray(data)) {
    data.forEach((value, index) => {
      const arrayKey = `${parentKey}[${index}]`;
      appendFormData(formData, value, arrayKey);
    });
  }

  else if (typeof data === "object" && !(data instanceof File)) {
    Object.entries(data).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}[${key}]` : key;

      if (key === "options" && Array.isArray(value)) {
        value.forEach((opt) => {
          formData.append(`${newKey}[][id]`, opt.id?.toString() || "");
          formData.append(`${newKey}[][value]`, opt.value || "");
        });
        return;
      }

      if (key === "image_data" && value?.filename?.startsWith("data:")) {
        try {
          const file = base64ToFile(
            value.filename,
            "upload.png",
            value.content_type || "image/png"
          );

          const imageKey = `${parentKey}[input_config_attributes][image]`;
          formData.append(imageKey, file);
        } catch (err) {
          console.error("❌ Error al convertir base64 a File:", err);
        }
        return;
      }

      appendFormData(formData, value, newKey);
    });
  }

  else {
    formData.append(parentKey, data);
  }
};

export const createForm = async (data: FormCreateResponse) => {
  const formData = new FormData();
  appendFormData(formData, data.form, "form");

  for (const [key, value] of formData.entries()) {
    console.log("📤", key, value);
  }

  return await api.post("/admin/forms", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

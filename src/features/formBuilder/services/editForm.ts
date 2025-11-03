/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/shared/api/api";
import { base64ToFile } from "../hooks/base64ToFile";

const normalizeTypes = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => normalizeTypes(item));
  }
  
  if (typeof obj === 'object') {
    const normalized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === 'true') {
        normalized[key] = true;
      } else if (value === 'false') {
        normalized[key] = false;
      }
      else if (['id', 'position'].includes(key) && typeof value === 'string' && /^\d+$/.test(value)) {
        normalized[key] = parseInt(value, 10);
      }
      else if (typeof value === 'object') {
        normalized[key] = normalizeTypes(value);
      }
      else {
        normalized[key] = value;
      }
    }
    return normalized;
  }
  
  return obj;
};

export const editForm = async (id: number, data: any) => {
  console.log("🚀 editForm data:", data);
  
  const form = data.form || data;
  
  let hasImages = false;
  const imageFiles: Array<{ path: string; file: File }> = [];
  
  if (form.steps_attributes && Array.isArray(form.steps_attributes)) {
    form.steps_attributes.forEach((step: any) => {
      if (step.inputs_attributes && Array.isArray(step.inputs_attributes)) {
        step.inputs_attributes.forEach((input: any) => {
          if (input.input_config_attributes?.image) {
            const imageData = input.input_config_attributes.image;
            const isBase64 = imageData.startsWith("data:");
            console.log(imageData)
            if (isBase64) {
              hasImages = true;
              try {
                const file = base64ToFile(
                  imageData,
                  imageData.name || "upload.png",
                  imageData.content_type || "image/png"
                );
                imageFiles.push({
                  path: `form[steps_attributes][][inputs_attributes][][input_config_attributes][image]`,
                  file
                });
                // Remover image_data del JSON para evitar duplicación
                delete input.input_config_attributes.image;
              } catch (err) {
                console.error("❌ Error al convertir base64 a File:", err);
              }
            }
          }
        });
      }
    });
  }
  
  if (!hasImages) {
    const normalizedData = normalizeTypes({ form });
    console.log("📤 Enviando JSON puro:", normalizedData);
    return await api.patch(`/admin/forms/${id}`, normalizedData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  
  const formData = new FormData();

  if (form.title) formData.append('form[title]', form.title);
  if (form.status) formData.append('form[status]', form.status);
  if (form.description !== undefined) formData.append('form[description]', form.description || '');

  if (form.steps_attributes && Array.isArray(form.steps_attributes)) {
    form.steps_attributes.forEach((step: any) => {
      const stepPrefix = `form[steps_attributes][]`;

      if (step.id) formData.append(`${stepPrefix}[id]`, step.id.toString());
      if (step.title) formData.append(`${stepPrefix}[title]`, step.title);
      if (step.position !== undefined) formData.append(`${stepPrefix}[position]`, step.position.toString());
      if (step._destroy) formData.append(`${stepPrefix}[_destroy]`, '1');

      if (step.inputs_attributes && Array.isArray(step.inputs_attributes)) {
        step.inputs_attributes.forEach((input: any) => {
          const inputPrefix = `${stepPrefix}[inputs_attributes][]`;

          if (input.id) formData.append(`${inputPrefix}[id]`, input.id.toString());
          if (input.name) formData.append(`${inputPrefix}[name]`, input.name);
          if (input.label) formData.append(`${inputPrefix}[label]`, input.label);
          if (input.position !== undefined) formData.append(`${inputPrefix}[position]`, input.position.toString());
          if (input.input_config_type) formData.append(`${inputPrefix}[input_config_type]`, input.input_config_type);
          if (input._destroy) formData.append(`${inputPrefix}[_destroy]`, '1');

          if (input.input_config_attributes) {
            const configPrefix = `${inputPrefix}[input_config_attributes]`;
            const config = input.input_config_attributes;

            if (config.required !== undefined) {
              formData.append(`${configPrefix}[required]`, String(config.required));
            }

            if (config.placeholder !== null && config.placeholder !== undefined) {
              formData.append(`${configPrefix}[placeholder]`, config.placeholder);
            }
            if (config.description !== null && config.description !== undefined) {
              formData.append(`${configPrefix}[description]`, config.description);
            }
            if (config.min_length !== null && config.min_length !== undefined) {
              formData.append(`${configPrefix}[min_length]`, config.min_length.toString());
            }
            if (config.max_length !== null && config.max_length !== undefined) {
              formData.append(`${configPrefix}[max_length]`, config.max_length.toString());
            }

            // Opciones (para select, checkbox, radio)
            if (config.options && Array.isArray(config.options)) {
              config.options.forEach((option: any) => {
                if (option.id) {
                  formData.append(`${configPrefix}[options][][id]`, option.id.toString());
                }
                if (option.value) {
                  formData.append(`${configPrefix}[options][][value]`, option.value);
                }
              });
            }
          }
        });
      }
    });
  }
  
  imageFiles.forEach(({ path, file }) => {
    formData.append(path, file);
  });

  for (const [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value instanceof File ? `[File: ${value.name}]` : value);
  }

  return await api.patch(`/admin/forms/${id}`, formData, {
    headers: { 
      "Content-Type": "multipart/form-data" 
    },
  });
};  
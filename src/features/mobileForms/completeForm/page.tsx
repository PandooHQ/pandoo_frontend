import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { LoadingScreen } from "@/shared/components/LoadingScreen";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import { getFormReponseById } from "../services/getUserResponseById";
import { FormFieldRenderer } from "../components/completeForm/FormFieldRenderer";
import type { FormInputField } from "../types/FormInputField";
import { updateUserResponse } from "../services/updateUserResponse";
import type { FormResponse } from "@/features/formEntry/types/FormResponse";
import type { Step } from "@/features/formEntry/types/FormAssignment";
import { buildFormResponseData } from "../hooks/buildFormResponseData";
import { ArrowLeft, ArrowRight } from "lucide-react";

const CompleteForm = () => {
  const router = useNavigate();
  const { lang } = useParams();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: FormResponse) =>
      updateUserResponse(Number(id), payload),
    onSuccess: (data) => {
      console.log(data);
      toast.success("Respuesta guardada correctamente:");
      queryClient.invalidateQueries({ queryKey: ["form_responses"] });
      queryClient.invalidateQueries({ queryKey: ["form_responses", id] });
      setTimeout(() => {
        router(`/${lang}/forms/mobile-forms`);
      }, 1500);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al guardar la respuesta:");
    },
  });

  const { data: formData } = useQuery({
    queryKey: ["form_response", Number(id)],
    queryFn: () => getFormReponseById(Number(id)),
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!formData) return;

    const initialValues: Record<string, unknown> = {};

    formData.steps?.forEach((step: Step) => {
      step.inputs?.forEach((input) => {
        const resp = input.response;

        if (!resp) return;

        if (resp && typeof resp === "object") {
          if (
            "value" in resp &&
            resp.value !== null &&
            resp.value !== undefined
          ) {
            initialValues[input.name] = resp.value;
          } else if ("values" in resp && Array.isArray(resp.values)) {
            initialValues[input.name] = resp.values;
          }
        }
      });
    });

    setFormValues((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      return initialValues;
    });
  }, [formData]);

  if (!formData) return <LoadingScreen />;

  const steps = formData.steps || [];
  const totalSteps = steps.length;
  const step = steps[currentStep];

  const handleChange = (name: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const validateForm = (): boolean => {
    console.log(formData);
    const newErrors: Record<string, string> = {};

    steps.forEach((s: { inputs: FormInputField[] }) => {
      s.inputs.forEach((input: FormInputField) => {
        if (input.required && !formValues[input.name]) {
          newErrors[input.name] = "Este campo es obligatorio.";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    const payload = buildFormResponseData(formData, formValues);
    mutation.mutate(payload);
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    if (!isValid) {
      toast.error(
        "Para enviar el formulario se requeire que llene todos los campos requeridos"
      );
      console.warn("❌ El formulario tiene campos requeridos sin completar.");
      return;
    }

    console.log(formValues);
    const payload = buildFormResponseData(formData, formValues, "sent");
    mutation.mutate(payload);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {formData.title}
          </h1>
          {formData.description && (
            <p className="text-sm text-gray-500 mt-1">{formData.description}</p>
          )}
        </div>

        <div className="w-full bg-gray-200 h-1">
          <motion.div
            className="h-1 bg-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto py-8 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              {step.title}
            </h2>

            <div className="space-y-6">
              {step.inputs.map((input: FormInputField) => (
                <div key={input.id} className="relative">
                  <FormFieldRenderer
                    input={input}
                    value={formValues[input.name]}
                    onChange={handleChange}
                  />
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[input.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="sticky bottom-0 bg-white border-t shadow-sm z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <div className="flex gap-2">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              className="rounded-full px-6 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5 block md:hidden" />

              <span className="hidden md:inline">← Atrás</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentStep >= totalSteps - 1}
              className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              <span className="hidden md:inline">Siguiente →</span>

              <ArrowRight className="h-5 w-5 block md:hidden" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              loading={mutation.isPending}
              disabled={mutation.isPending}
              onClick={handleSave}
              className="rounded-full px-6 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Guardar
            </Button>
            {currentStep === totalSteps - 1 && (
              <Button
                loading={mutation.isPending}
                disabled={mutation.isPending}
                onClick={handleSubmit}
                className="rounded-full px-8 bg-green-600 hover:bg-green-700 text-white"
              >
                Enviar
              </Button>
            )}
          </div>
        </div>
      </footer>
      <Toaster richColors />
    </div>
  );
};

export default CompleteForm;

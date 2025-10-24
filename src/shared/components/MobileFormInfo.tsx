import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Eye, ClipboardType, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFormReponseById } from "../../features/mobileForms/services/getUserResponseById";
import { Separator } from "@/shared/components/ui/separator";
import { exportFormResponse } from "../api/exportFormResponse";

interface Props {
  open: boolean;
  onClose: () => void;
  formId: number;
}

interface MobileFormResponse {
  id: number;
  title: string;
  steps: MobileFormStep[];
}

interface MobileFormStep {
  id: number;
  title: string;
  inputs: MobileFormInput[];
}

type InputType =
  | "text"
  | "number"
  | "datetime"
  | "select"
  | "signature"
  | "checkbox";

interface MobileFormInput {
  id: number;
  label: string;
  type: InputType;
  response?: {
    value?: string;
    values?: string[];
  };
  options?: {
    id: string;
    value: string;
  }[];
}

const MobileFormInfo = ({ open, onClose, formId }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    data: mobileForm,
    isLoading,
    isError,
  } = useQuery<MobileFormResponse>({
    queryKey: ["mobileForm", formId],
    queryFn: () => getFormReponseById(formId),
    enabled: open,
  });
  
  const handleDownloadPDF = async () => {
    try {
      await exportFormResponse(formId);
    } catch (err) {
      console.error("Error al exportar PDF:", err);
    }
  };

  if (!mobileForm || isLoading) return null;
  if (isError) return <p>Error al cargar la información</p>;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div ref={contentRef}>
          <DialogHeader className="flex items-center gap-2 flex-row justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <DialogTitle className="text-lg font-semibold">
                {mobileForm.title || "Formulario"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="mt-4 space-y-6 max-h-[65vh] overflow-y-auto pr-2">
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="no-export"
            >
              <Download className="w-4 h-4 mr-2" /> Exportar
            </Button>
            {mobileForm.steps.map((section) => (
              <div key={section.id}>
                <div className="text-md font-semibold text-gray-800 mb-2 flex flex-row gap-2">
                  <ClipboardType className="w-5 h-5" />
                  {section.title}
                </div>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {section.inputs.map((input) => {
                    const renderValue = () => {
                      if (input.type === "signature") {
                        return (
                          <img
                            src={input.response?.value}
                            alt="Firma del usuario"
                            className="w-40 h-20 border border-gray-300 rounded"
                          />
                        );
                      }

                      if (
                        input.type === "checkbox" ||
                        input.type === "select"
                      ) {
                        const selectedValues = input.response?.values || [];

                        const selectedLabels =
                          input.options
                            ?.filter((opt) => selectedValues.includes(opt.id))
                            .map((opt) => opt.value) || [];

                        return selectedLabels.length > 0 ? (
                          <ul className="list-disc list-inside text-gray-900 font-medium">
                            {selectedLabels.map((label, i) => (
                              <li key={i}>{label}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic">
                            Sin selección
                          </span>
                        );
                      }

                      return (
                        <span className="text-gray-900 font-medium">
                          {input.response?.value || "-"}
                        </span>
                      );
                    };

                    return (
                      <div key={input.id} className="flex flex-col">
                        <span className="text-gray-500 text-sm">
                          {input.label}
                        </span>
                        {renderValue()}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="mt-6 flex justify-center">
            <Button onClick={onClose} className="no-export">
              Cerrar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileFormInfo;

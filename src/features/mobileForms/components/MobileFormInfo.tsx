import { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
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
import { getFormReponseById } from "../services/getUserResponseById";

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

type InputType = "text" | "number" | "datetime" | "select" | "signature";

interface MobileFormInput {
  id: number;
  label: string;
  type: InputType;
  response?: {
    value?: string;
    values?: string[];
  };
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
    if (!contentRef.current) return;

    const element = contentRef.current;
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true, 
      backgroundColor: "#ffffff",
      ignoreElements: (el) => el.classList.contains("no-export"),
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);

    const pdfWidth = pageWidth - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    if (pdfHeight < pageHeight - 20) {
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
    } else {
      let y = 0;
      while (y < canvas.height) {
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = pageHeight * (canvas.width / pageWidth);

        const ctx = pageCanvas.getContext("2d")!;
        ctx.drawImage(
          canvas,
          0,
          y,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          canvas.width,
          pageCanvas.height
        );

        const pageData = pageCanvas.toDataURL("image/png");
        pdf.addImage(pageData, "PNG", 10, 10, pdfWidth, pdfHeight);
        y += pageCanvas.height;
        if (y < canvas.height) pdf.addPage();
      }
    }

    pdf.save(`${mobileForm?.title || "formulario"}.pdf`);
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
              className="no-export w-full"
            >
              <Download className="w-4 h-4 mr-2" /> Exportar
            </Button>
            {mobileForm.steps.map((section) => (
              <div key={section.id}>
                <div className="text-md font-semibold text-gray-800 mb-2 flex flex-row gap-2">
                  <ClipboardType className="w-5 h-5" />
                  {section.title}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.inputs.map((input) => (
                    <div key={input.id} className="flex flex-col">
                      <span className="text-gray-500 text-sm">
                        {input.label}
                      </span>
                      {input.type === "signature" ? (
                        <img
                          src={input.response?.value}
                          alt="Firma del usuario"
                          className="w-40 h-20 border border-gray-300 rounded"
                        />
                      ) : input.type === "select" ? (
                        <span className="text-gray-900 font-medium">
                          {input.response?.values?.join(", ") || "-"}
                        </span>
                      ) : (
                        <span className="text-gray-900 font-medium">
                          {input.response?.value || "-"}
                        </span>
                      )}
                    </div>
                  ))}
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

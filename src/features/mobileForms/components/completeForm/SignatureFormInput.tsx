import { useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignatureFormInputProps {
  field: {
    id: number;
    name: string;
    label: string;
    required?: boolean;
    default_value?: string | null;
    response?: { value?: string };
  };
  value?: string;
  onChange?: (value: string) => void;
}

const SignatureFormInput = ({ field, onChange }: SignatureFormInputProps) => {
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = sigCanvas.current;
      const container = containerRef.current;
      if (canvas && container) {
        const canvasEl = canvas.getCanvas();
        canvasEl.width = container.offsetWidth;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    if (field.response?.value && sigCanvas.current) {
      try {
        sigCanvas.current.fromDataURL(field.response.value);
      } catch (err) {
        console.warn("No se pudo cargar la firma previa:", err);
      }
    }
  }, [field.response?.value]);

  const clearSignature = () => {
    sigCanvas.current?.clear();
    onChange?.("");
  };

  const saveSignature = () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) return;
    const dataUrl = sigCanvas.current.getCanvas().toDataURL("image/png");
    onChange?.(dataUrl);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={`field-${field.id}`} className="text-sm font-medium">
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
      </label>

      <div ref={containerRef} className="border rounded-lg w-full">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            className: "bg-white rounded-lg w-full h-[200px]",
          }}
        />
      </div>

      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={clearSignature}
          className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition-colors hover:cursor-pointer"
        >
          Limpiar
        </button>

        <button
          type="button"
          onClick={saveSignature}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors hover:cursor-pointer"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default SignatureFormInput;

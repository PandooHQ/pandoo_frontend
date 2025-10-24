import { type Dispatch, type SetStateAction } from "react";
import { Eye, FileDown, MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { exportFormResponse } from "@/shared/api/exportFormResponse";

interface Props {
  formId: number;
  setSelectedResponseId: Dispatch<SetStateAction<number | null>>;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export function DropdownMenuDialog({
  formId,
  setSelectedResponseId,
  setOpenModal,
}: Props) {
  const handleDownloadPDF = async () => {
    try {
      await exportFormResponse(formId);
    } catch (err) {
      console.error("Error al exportar PDF:", err);
    }
  };

  const handleViewDetails = () => {
    setSelectedResponseId(formId);
    setOpenModal(true);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" aria-label="Abrir menú" title="Abrir menú">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-44" align="end">
        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleViewDetails}>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Ver detalles</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDownloadPDF}>
            <div className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              <span>Exportar PDF</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

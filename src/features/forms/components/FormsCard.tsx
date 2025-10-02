import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Calendar,
  Copy,
  Edit,
  MoreVertical,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import type { FormType } from "../types/FormType";
import type { FormCardsProps } from "../types/FormCardsTypes";
import { useMyForms } from "../hooks/useMyForm";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { useState } from "react";
import { useFormMutation } from "@/shared/hooks/useFormMutation";
import { deleteForm } from "../services/deleteForm";
import { getForm } from "../services/getForm";
import { useQueryClient } from "@tanstack/react-query";

export const FormCards = ({ forms }: FormCardsProps) => {
  const { getStatusLabel, getStatusColor, duplicateForm } = useMyForms();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const deleteMutation = useFormMutation(deleteForm);

  const handlePrefetch = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ["form", id],
      queryFn: () => getForm(id),
    });
  };

  const handleDeleteClick = (id: number) => {
    setSelectedFormId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFormId !== null) {
      deleteMutation.mutate(selectedFormId);
    }
  };

  return (
    <>
      {forms.length > 0 &&
        forms?.map((form: FormType) => (
          <Card
            key={form.id}
            className="hover:shadow-md transition-shadow"
            onMouseEnter={() => handlePrefetch(form.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg leading-tight">
                    {form.title}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {form.description}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate(`edit/${form.id}`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Vista Previa
                  </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={() => duplicateForm(form)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(form.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Badge
                  variant="secondary"
                  className={getStatusColor(form.status!)}
                >
                  {getStatusLabel(form.status!)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {form.responses || 0} respuestas
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(form.created_at!).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full bg-transparent">
                Continuar
              </Button>
            </CardFooter>
          </Card>
        ))}

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar formulario"
        description="¿Estás seguro que deseas eliminar este formulario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </>
  );
};

import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  useDndContext,
} from "@dnd-kit/core";
import InputsMenuCard from "./components/InputsMenuCard";
import Section from "./components/sections/Section";
import { useFormBuilder } from "./hooks/useFormBuilder";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle, Redo, Undo, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { useParams } from "react-router-dom";
import type { FormType } from "../forms/types/FormType";
import { useQuery } from "@tanstack/react-query";
import { getForm } from "../forms/services/getForm";
import { denormalizeFormFromBackend } from "@/shared/lib/denormalizedForm";

export default function FormBuilderEditPage() {
  const [menuKey, setMenuKey] = useState(() => Date.now());
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormType | null>(null);

  const formId = id ? parseInt(id, 10) : undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => {
      console.log("🚀 Haciendo petición para form:", formId);
      return getForm(formId!);
    },
    enabled: !!formId && !isNaN(formId),
    staleTime: 1000 * 60 * 5,
  });

  const {
    sensors,
    collisionDetectionStrategy,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    activeId,
    containers,
    historyIndex,
    sections,
    newForm,
    undo,
    redo,
    setNewForm,
    handleUpdateForm,
    addSection,
    isSortingContainer,
    removeSection,
    updateSection,
    updateItem,
    removeItem,
  } = useFormBuilder({
    form: formData ?? undefined,
    sections: formData?.sections ?? undefined,
  });

  const { active } = useDndContext();

  useEffect(() => {
    if (!data) return;

    const payload = data.data ?? data;
    const denormalizedForm = denormalizeFormFromBackend(payload);
    setFormData(denormalizedForm);
  }, [data]);

  if (!formId || isNaN(formId)) {
    return <p>ID de formulario inválido</p>;
  }

  if (isLoading) return <p>Cargando...</p>;

  if (error) return <p>Error al cargar el formulario</p>;

  if (!formData) return <p>Cargando datos del formulario...</p>;

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Editar formulario
          </h1>
          <p className="text-muted-foreground">
            Construye tu formulario desde cero con campos personalizados
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={historyIndex <= 0}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleUpdateForm(formId,"published", formData)}
            disabled={newForm.status == "published"}
            className={
              newForm.status == "published"
                ? "bg-green-600 hover:bg-green-700"
                : ""
            }
          >
            {newForm.status == "published" ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Publicado
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Publicar Formulario
              </>
            )}
          </Button>
          <Button onClick={() => handleUpdateForm(formId,"draft", formData)}>Guardar Formulario</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr_1fr]">
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={(e) => {
            handleDragEnd(e);
            setMenuKey(Date.now());
          }}
        >
          <InputsMenuCard key={menuKey} menuKey={menuKey} />

          <Section
            containers={containers}
            sections={sections}
            addSection={addSection}
            isSortingContainer={isSortingContainer}
            removeSection={removeSection}
            updateSection={updateSection}
            updateItem={updateItem}
            removeItem={removeItem}
          />
          <DragOverlay>
            {activeId ? (
              containers.includes(activeId) ? (
                <div
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "12px",
                    minWidth: "200px",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <h3 style={{ fontWeight: 600, margin: 0 }}>
                    {sections.find((s) => s.id === activeId)?.title || activeId}
                  </h3>
                  {(sections.find((s) => s.id === activeId)?.items || []).map(
                    (item) => (
                      <div
                        key={item.id}
                        style={{
                          background: "#fff",
                          padding: "8px 12px",
                          margin: "4px 0",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      >
                        {item.label}
                      </div>
                    )
                  )}
                </div>
              ) : active?.data?.current?.isFromMenu ? (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {active.data.current.icon && (
                    <active.data.current.icon className="h-4 w-4" />
                  )}
                  {active.data.current.label}
                </div>
              ) : (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                  }}
                >
                  {sections
                    ?.flatMap((s) => s.items)
                    .find((i) => i.id === activeId)?.label || activeId}
                </div>
              )
            ) : null}
          </DragOverlay>
        </DndContext>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos del formulario</CardTitle>
              <CardDescription>
                Configure los detalles y ajustes de su formulario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form-title">Título del Formulario</Label>
                <Input
                  id="form-title"
                  value={newForm.title}
                  onChange={(e) =>
                    setNewForm({ ...newForm, title: e.target.value })
                  }
                  placeholder="Ingrese el título del formulario"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="form-description">Descripción</Label>
                <Textarea
                  id="form-description"
                  value={newForm.description}
                  onChange={(e) =>
                    setNewForm({ ...newForm, description: e.target.value })
                  }
                  placeholder="Ingrese la descripción del formulario (opcional)"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Configuración del Formulario</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="allow-multiple" />
                    <Label htmlFor="allow-multiple" className="text-sm">
                      Permitir múltiples envíos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="require-login" />
                    <Label htmlFor="require-login" className="text-sm">
                      Requerir inicio de sesión para enviar
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="send-confirmation" />
                    <Label htmlFor="send-confirmation" className="text-sm">
                      Enviar correo de confirmación
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Campos de Configuración</CardTitle>
              <CardDescription>
                Configure los detalles y ajustes de los campos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <img src="/ConstructSection.png" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

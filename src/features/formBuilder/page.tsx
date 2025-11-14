import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  useDndContext,
  type UniqueIdentifier,
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
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { Toaster } from "sonner";
import { Switch } from "@/shared/components/ui/switch";
import { typeActiveId, typeIcon } from "../forms/types/FormTypeMap";
import { useDnd } from "./hooks/useDnd";

export default function Page() {
  const [menuKey, setMenuKey] = useState(() => Date.now());
  const {
    historyIndex,
    history,
    containers,
    sections,
    setSections,
    setContainers,
    newForm,
    setNewForm,
    saveForm,
    addSection,
    removeSection,
    updateSection,
    updateItem,
    removeItem,
    undo,
    redo,
  } = useFormBuilder();
  
  const {
    sensors,
    collisionDetectionStrategy,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    activeId,
    isSortingContainer,
  } = useDnd({
    sections,
    setSections,
    containers,
    setContainers,
  });
  const { active } = useDndContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenItem, setModalOpenItem] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<
    number | UniqueIdentifier | null
  >(null);
  const [selectedInput, setSelectedInput] = useState<UniqueIdentifier>();
  const [selectedFieldId, setSelectedFieldId] = useState<string>("");

  const handleDeleteClick = (id: number | UniqueIdentifier) => {
    setSelectedFormId(id);
    setModalOpen(true);
  };

  const handleDeleteClickItem = (id: string) => {
    setSelectedFieldId(id);
    setModalOpenItem(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFormId !== null) removeSection(selectedFormId);
  };

  const handleConfirmDeleteItem = () => {
    if (selectedFieldId !== null) {
      removeItem(selectedFieldId);
    }
  };

  const selectedItem = sections
    .flatMap((s) => s.items)
    .find((i) => i.id === selectedInput);

  useEffect(() => {
    if (selectedInput && !selectedItem) {
      setSelectedInput(undefined);
    }
  }, [selectedItem, selectedInput]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
      <div className="flex items-center justify-between flex-col gap-4 lg:flex-row">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Crear Formulario en Blanco
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
            onClick={() => saveForm("published")}
            disabled={
              newForm.status === "published" ||
              sections?.length === 0 ||
              newForm.title === '' ||
              !sections?.some(section => section.items?.length > 0)
            }
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
          <Button onClick={() => saveForm()}>Guardar Formulario</Button>
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
            removeSection={handleDeleteClick}
            updateSection={updateSection}
            updateItem={updateItem}
            removeItem={handleDeleteClickItem}
            setSelectedInput={setSelectedInput}
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
                (() => {
                  const typeKey = String(activeId).split("-")[0];
                  const type = typeActiveId[typeKey];
                  const activeLabel = sections
                    ?.flatMap((s) => s.items)
                    .find((i) => i.id === activeId)?.label;
                  const IconComponent = typeIcon[typeKey];

                  return (
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
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      {activeLabel || type}
                    </div>
                  );
                })()
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
            </CardContent>
          </Card>
          <Card className="shrink-0">
            <CardHeader>
              <CardTitle>Campos de Configuración</CardTitle>
              <CardDescription>
                Configure los detalles y ajustes de los campos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="min-h-[200px] flex flex-col justify-center">
                {selectedItem ? (
                  <>
                    {selectedItem.type === "number" && (
                      <div
                        key={selectedItem.id}
                        className="flex items-center space-x-2"
                      >
                        <Switch
                          checked={selectedItem.allow_decimal || false}
                          onCheckedChange={(checked) =>
                            updateItem(selectedItem.id, {
                              allow_decimal: checked,
                            })
                          }
                        />
                        <Label
                          htmlFor={`required-${selectedItem.id}`}
                          className="font-light"
                        >
                          Permitir decimales
                        </Label>
                      </div>
                    )}

                    {selectedItem.type !== "number" && (
                      <div className="flex items-center justify-center h-full">
                        <img
                          src="/ConstructSection.png"
                          alt="Sin configuración disponible"
                          className="max-w-full h-auto"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <img
                      src="/ConstructSection.png"
                      alt="Selecciona un campo"
                      className="max-w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Seccion"
        description="¿Estás seguro que deseas eliminar esta seccion? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      <ConfirmModal
        isOpen={modalOpenItem}
        onClose={() => setModalOpenItem(false)}
        onConfirm={handleConfirmDeleteItem}
        title="Eliminar Campo"
        description="¿Estás seguro que deseas eliminar este campo? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
      <Toaster richColors />
    </div>
  );
}

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
import { CheckCircle, Upload } from "lucide-react";
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

export default function FormBuilderEditPage() {
  const [menuKey, setMenuKey] = useState(() => Date.now());
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormType | null>(null);

  useEffect(() => {
    const storedForms = localStorage.getItem("forms");
    if (storedForms) {
      const forms: FormType[] = JSON.parse(storedForms);
      const form = forms.find((f) => f.id.toString() === id);
      if (form) setFormData(form);
    }
    console.log(formData)
  }, [id]);

  const {
    sensors,
    collisionDetectionStrategy,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    activeId,
    containers,
    sections,
    newForm,
    setNewForm,
    updateForm,
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


  if (!formData) return <p>Cargando...</p>;

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
          {/* {selectedSectionId && (
            <p className="text-sm text-blue-600 mt-1">
              Seleccionado:{" "}
              {sections.find((s) => s.id === selectedSectionId)?.title ||
                "Sección Desconocida"}
            </p>
          )} */}
        </div>
        <div className="flex gap-2">
          {/* <Button
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
          </Button>*/}

          <Button
            onClick={() => updateForm("published")}
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
          {/* <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setCurrentSheetIndex(0)}>
                <Smartphone className="mr-2 h-4 w-4" />
                Vista Previa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[660px] p-0 w-fit">
              <div
                className="bg-white dark:bg-gray-950 rounded-lg overflow-hidden shadow-lg flex flex-col"
                style={{ height: "600px", width: "320px" }}
              >
                <div className="bg-white dark:bg-gray-950 px-4 py-2 flex items-center justify-between text-xs border-b flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <div className="flex items-end gap-0.5 mr-2">
                      <div className="w-1 h-2 bg-gray-800 dark:bg-white rounded-full"></div>
                      <div className="w-1 h-2.5 bg-gray-800 dark:bg-white rounded-full"></div>
                      <div className="w-1 h-3 bg-gray-800 dark:bg-white rounded-full"></div>
                      <div className="w-1 h-3.5 bg-gray-800 dark:bg-white rounded-full"></div>
                    </div>
                    <svg
                      className="w-3 h-3 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                    </svg>
                  </div>
                  <div className="font-medium">9:41 AM</div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">87%</span>
                    <div className="w-6 h-3 border border-gray-800 dark:border-white rounded-sm relative flex items-center">
                      <div className="w-4 h-1.5 bg-gray-800 dark:bg-white rounded-sm ml-0.5"></div>
                      <div className="w-0.5 h-1.5 bg-gray-800 dark:bg-white rounded-sm absolute -right-1"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-950 border-b px-4 py-4 flex items-center flex-shrink-0">
                  <button className="mr-3 flex items-center justify-center">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <h1 className="text-lg font-medium">{formTitle}</h1>
                    <p className="text-sm text-muted-foreground">
                      Recolección de Datos
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 border-b flex-shrink-0">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Paso {currentSheetIndex + 1} de{" "}
                      {getSectionsWithFields().length}
                    </span>
                    <span className="font-medium">
                      {Math.round(
                        ((currentSheetIndex + 1) /
                          getSectionsWithFields().length) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((currentSheetIndex + 1) / getSectionsWithFields().length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  {getSectionsWithFields().length > 0 ? (
                    <div className="space-y-4">
                      {getCurrentSection() && (
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                            <User className="h-5 w-5 text-blue-500" />
                            <h3 className="font-medium text-base">
                              {getCurrentSection()?.title}
                            </h3>
                          </div>

                          {getCurrentSectionFields().map((field) => (
                            <div key={field.id} className="space-y-2">
                              {field.type === "instructions" ? (
                                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                  <div
                                    className="text-sm text-blue-900 dark:text-blue-100"
                                    dangerouslySetInnerHTML={{
                                      __html: formatInstructionsContent(
                                        field.content || ""
                                      ),
                                    }}
                                  />
                                </div>
                              ) : field.type === "signature" ? (
                                <>
                                  <Label className="text-sm font-medium">
                                    {field.label}
                                    {field.required && (
                                      <span className="text-red-500 ml-1">
                                        *
                                      </span>
                                    )}
                                  </Label>
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                                    <PenTool className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-500">
                                      Toca para firmar
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {field.label}
                                    {field.required && (
                                      <span className="text-red-500 ml-1">
                                        *
                                      </span>
                                    )}
                                  </Label>
                                  {field.type === "text" && (
                                    <div className="relative">
                                      <Input
                                        className="text-sm pl-4 py-3 rounded-lg border-gray-300 focus:border-blue-500"
                                        placeholder={
                                          field.placeholder ||
                                          `Enter ${field.label.toLowerCase()}`
                                        }
                                      />
                                    </div>
                                  )}
                                  {field.type === "email" && (
                                    <div className="relative">
                                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                      <Input
                                        className="text-sm pl-10 py-3 rounded-lg border-gray-300 focus:border-blue-500"
                                        type="email"
                                        placeholder={
                                          field.placeholder ||
                                          "Ingrese dirección de correo"
                                        }
                                      />
                                    </div>
                                  )}
                                  {field.type === "number" && (
                                    <div className="relative">
                                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                      <Input
                                        className="text-sm pl-10 py-3 rounded-lg border-gray-300 focus:border-blue-500"
                                        type="number"
                                        placeholder={
                                          field.placeholder || "Ingrese número"
                                        }
                                      />
                                    </div>
                                  )}
                                  {field.type === "textarea" && (
                                    <Textarea
                                      className="text-sm py-3 rounded-lg border-gray-300 focus:border-blue-500"
                                      placeholder={
                                        field.placeholder ||
                                        `Enter ${field.label.toLowerCase()}`
                                      }
                                    />
                                  )}
                                  {field.type === "select" && (
                                    <Select>
                                      <SelectTrigger className="text-sm py-3 rounded-lg border-gray-300 focus:border-blue-500">
                                        <SelectValue
                                          placeholder={`Seleccionar ${field.label.toLowerCase()}`}
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {field.options?.map((option, index) => (
                                          <SelectItem
                                            key={index}
                                            value={option.toLowerCase()}
                                          >
                                            {option}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      Agregue secciones con campos para ver la vista previa de
                      su formulario
                    </div>
                  )}
                </div>

                <div className="px-4 py-4 bg-white dark:bg-gray-950 border-t flex-shrink-0">
                  <div className="space-y-3">
                    {canNavigatePrev() && (
                      <Button
                        variant="outline"
                        className="w-full py-3 rounded-lg font-medium bg-transparent"
                        onClick={() => navigateToSheet("prev")}
                      >
                        Anterior
                      </Button>
                    )}

                    {canNavigateNext() ? (
                      <Button
                        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                        onClick={() => navigateToSheet("next")}
                      >
                        Siguiente
                      </Button>
                    ) : (
                      <Button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                        Enviar Formulario
                      </Button>
                    )}

                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Auto-guardado</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>En línea</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog> */}
          <Button onClick={() => updateForm()}>Guardar Formulario</Button>
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

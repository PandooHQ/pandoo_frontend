/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  closestCenter,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SectionType } from "../types/SectionType";
import type { ItemType } from "../types/ItemType";
import type { FormType } from "@/features/forms/types/FormType";
import { typeMap } from "@/features/forms/types/FormTypeMap";
import { createForm } from "../services/createForm";
import { useFormMutation } from "@/shared/hooks/useFormMutation";
import { useEditForm } from "./useEditForm";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

interface FormBuilderInitialValues {
  form?: FormType;
  sections?: SectionType[];
}

export const useFormBuilder = (initialValues?: FormBuilderInitialValues) => {

  const [history, setHistory] = useState<SectionType[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const createMutation = useFormMutation(createForm);
  const { lang } = useParams()
  const router = useNavigate()

  const [newForm, setNewForm] = useState<FormType>({
    id: Math.floor(Math.random() * 100),
    title: "",
    description: "",
    status: "draft",
    created_at: new Date().toISOString(),
    responses: 0,
    lastModified: new Date().toISOString(),
    sections: [],
  });

  const [sections, setSections] = useState<SectionType[]>([]);

  useEffect(() => {
    if (initialValues?.form) setNewForm(initialValues.form);
    if (initialValues?.sections) setSections(initialValues.sections);
  }, [initialValues?.form, initialValues?.sections]);

  const [containers, setContainers] = useState<UniqueIdentifier[]>(
    (sections ?? []).map((section) => section.id)
  );

  useEffect(() => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      if (
        newHistory.length === 0 ||
        JSON.stringify(newHistory[newHistory.length - 1]) !==
          JSON.stringify(sections)
      ) {
        newHistory.push(sections);
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      }
      return prev;
    });
  }, [sections]);

  function buildPayload(original: any, edited: any) {
    const steps_attributes: any[] = [];

    edited.sections.forEach((editedStep: any, stepIndex: number) => {
      const origStep = original.sections.find(
        (s: any) => s.id === editedStep.id
      );

      const processInput = (input: any, pos: number) => {
        const {
          id,
          type,
          required,
          placeholder,
          minLength,
          maxLength,
          isTemporary,
          ...rest
        } = input;

        const processTest = buildAttributes(input)
        console.log(processTest)

        return {
          ...(isTemporary ? { name: id } : { id }),
          ...rest,
          position: pos + 1,
          input_config_type: type,
          input_config_attributes: {
            required,
            placeholder,
            min_length: minLength,
            max_length: maxLength,
            options: processTest.options,
          },
        };
      };

      if (!origStep) {
        steps_attributes.push({
          id: editedStep.id,
          title: editedStep.title,
          position: stepIndex + 1,
          inputs_attributes: (editedStep.items || []).map(processInput),
        });
      } else {
        const processedInputs: any[] = [];

        (editedStep.items || []).forEach((ei: any, i: number) => {
          const origInput = (origStep.items || []).find(
            (oi: any) => oi.id === ei.id
          );

          if (!origInput) {
            processedInputs.push(processInput(ei, i));
          } else {
            processedInputs.push(processInput(ei, i));
          }
        });

        (origStep.items || []).forEach((oi: any, i: number) => {
          if (!(editedStep.items || []).find((ei: any) => ei.id === oi.id)) {
            processedInputs.push({
              ...processInput(oi, i),
              _destroy: 1,
            });
          }
        });

        steps_attributes.push({
          id: editedStep.id,
          title: editedStep.title,
          position: stepIndex + 1,
          inputs_attributes: processedInputs,
        });
      }
    });

    original.sections.forEach((origStep: any, i: number) => {
      if (!edited.sections.find((es: any) => es.id === origStep.id)) {
        steps_attributes.push({
          id: origStep.id,
          title: origStep.title,
          position: i + 1,
          _destroy: 1,
          sections_attributes: [],
          inputs_attributes: (origStep.items || []).map(() => ({
            // ...processInput(oi, j),
            _destroy: 1,
          })),
        });
      }

    });
    return {
      title: original.title,
      status: original.status,
      description: original.description,
      steps_attributes,
    };
  }

  const { mutate: updateFormMutation } = useEditForm();

  const handleUpdateForm = async (
    status: "draft" | "published",
    initialForm: FormType
  ) => {
    const formToUpdate = { ...newForm, status, sections };

    const formToSend = buildPayload(initialForm, formToUpdate);
    formToSend.title = formToUpdate.title;
    formToSend.description = formToUpdate.description;
    formToSend.status = status;


    try{
      await updateFormMutation({ form: formToSend });

      toast.success("El formulario ha sido actualizado correctamente")
    
      setTimeout(() => {
        router(`/${lang}/forms`)
      }, 1500);
    }catch(e){
      console.error(e)
      toast.error("Ha ocurrido un error durante la actualizacion" )
    }
  };


  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  const isSortingContainer =
    activeId != null ? containers.includes(activeId) : false;

  const saveForm = async (status: "draft" | "published" = "draft") => {
    const formToSave = { ...newForm, status, sections };
    const formToSend = normalizeAndValidateForm(formToSave);
    try{
      await createMutation.mutate(formToSend);
      toast.success("Formulario creado exitosamente")

      setTimeout(() => {
        router(`/${lang}/forms`)
      }, 1500);
    }catch(e){
      console.error(e)
      toast.error("Ha ocurrido un error ")
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const collisionDetectionStrategy = useCallback(
    (args: any) => {
      // Si el draggable activo es una sección
      if (activeId && sections.some((s) => s.id === activeId)) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container: any) => sections.some((s) => s.id === container.id)
          ),
        });
      }

      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);

      let overId = getFirstCollision(intersections, "id");

      if (overId != null) {
        // Si el overId es una sección
        const overSection = sections.find((s) => s.id === overId);
        if (overSection) {
          const containerItems = overSection.items;

          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container: any) =>
                  container.id !== overId &&
                  containerItems.some((item) => item.id === container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, sections]
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [sections]);

  useEffect(() => {
    setContainers(sections.map((section) => section.id));
  }, [sections]);

  const handleDragStart = ({ active }: any) => {
    setActiveId(active.id);
  };

  const handleDragOver = ({ active, over }: any) => {
    const overId = over?.id;
    if (overId == null) return;

    if (sections.some((s) => s.id === active.id)) return;

    const activeSection = sections.find((s) =>
      s.items.some((item) => item.id === active.id)
    );
    const overSection = sections.find(
      (s) => s.items.some((item) => item.id === overId) || s.id === overId
    );

    if (!activeSection || !overSection) {
      const { isFromMenu, label, type } = active.data.current || {};

      if (isFromMenu) {
        const already = overSection?.items.some((i) => i.id === active.id);
        if (already) return;
        setSections((prev) =>
          prev.map((s) =>
            s.id === overSection?.id
              ? {
                  ...s,
                  items: [
                    ...s.items,
                    {
                      id: active.id,
                      label: label,
                      type: type,
                      required: false,
                      isTemporary: true,
                    },
                  ],
                }
              : s
          )
        );
        return;
      } else if (overSection) {
        setSections((prevSections) =>
          prevSections.map((section) =>
            section.id === overSection.id
              ? {
                  ...section,
                  items: [
                    ...section.items,
                    {
                      id: active.id,
                      label: active.data.current.label,
                      type: active.data.current.type,
                      required: false,
                    },
                  ],
                }
              : section
          )
        );
      }
      return;
    }

    if (activeSection.id !== overSection.id) {
      recentlyMovedToNewContainer.current = true;

      setSections((prevSections) =>
        prevSections.map((section) => {
          if (section.id === activeSection.id) {
            return {
              ...section,
              items: section.items.filter((item) => item.id !== active.id),
            };
          }
          if (section.id === overSection.id) {
            const overIndex = section.items.findIndex((i) => i.id === overId);
            const insertIndex =
              overIndex >= 0 ? overIndex : section.items.length;
            const newItems = [...section.items];
            newItems.splice(
              insertIndex,
              0,
              activeSection.items.find((i) => i.id === active.id)!
            );
            return { ...section, items: newItems };
          }
          return section;
        })
      );
    }
  };

  const handleDragEnd = ({ active, over }: any) => {
    if (!over) {
      setActiveId(null);
      return;
    }

    if (containers.includes(active.id)) {
      const activeIndex = containers.indexOf(active.id);
      const overIndex = containers.indexOf(over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        setContainers((prevContainers) =>
          arrayMove(prevContainers, activeIndex, overIndex)
        );

        setSections((prevSections) => {
          const newSections = arrayMove(prevSections, activeIndex, overIndex);
          return newSections;
        });
      }
    } else {
      const activeContainer = sections.find((section) =>
        section.items.some((item) => item.id === active.id)
      );
      const overContainer = sections.find((section) =>
        section.items.some((item) => item.id === over.id)
      );

      if (!activeContainer || !overContainer) {
        const { isFromMenu } = active.data.current || {};

        if (isFromMenu) {
          setSections((prev) =>
            prev.map((s) => ({
              ...s,
              items: s.items.map((it) =>
                it.id === active.id ? { ...it, isTemporary: false } : it
              ),
            }))
          );
          setActiveId(null);
          return;
        }
      }

      const activeIndex =
        activeContainer?.items.findIndex((item) => item.id === active.id) || 0;
      const overIndex =
        overContainer?.items.findIndex((item) => item.id === over.id) || 0;

      if (activeContainer?.id === overContainer?.id) {
        if (activeIndex !== overIndex) {
          setSections((prevSections) =>
            prevSections.map((section) =>
              section.id === activeContainer?.id
                ? {
                    ...section,
                    items: arrayMove(section.items, activeIndex, overIndex),
                  }
                : section
            )
          );
        }
      } else {
        setSections((prevSections) => {
          const newSections = [...prevSections];
          const sourceSectionIndex = newSections.findIndex(
            (section) => section.id === activeContainer?.id
          );
          const destinationSectionIndex = newSections.findIndex(
            (section) => section.id === overContainer?.id
          );

          if (sourceSectionIndex !== -1 && destinationSectionIndex !== -1) {
            const itemToMove = newSections[sourceSectionIndex].items.splice(
              activeIndex,
              1
            )[0];
            newSections[destinationSectionIndex].items.splice(
              overIndex,
              0,
              itemToMove
            );
          }

          return newSections;
        });
      }
    }

    setActiveId(null);
  };

  const addSection = () => {
    const newSection: SectionType = {
      id: `Sortable-${Date.now()}`,
      title: `Nueva Sección`,
      items: [],
    };

    setSections((prev) => [...prev, newSection]);
  };

  const removeSection = (id: UniqueIdentifier) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
  };

  const updateSection = (id: UniqueIdentifier, title: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, title } : section
      )
    );
  };

  const updateItem = (itemId: string, updates: Partial<ItemType>) => {
    console.log(updates, itemId)
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      }))
    );
  };

  const removeItem = (itemId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        items: section.items.filter((item) => item.id !== itemId),
      }))
    );
  };

  const undo = () => {
    if (historyIndex > 0) {
      setSections(history[historyIndex - 1]);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setSections(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  };

  const normalizeFormForBackend = (form: FormType) => {
    const keepIdIfNumber = (id: unknown) =>
      typeof id === "number" ? { id } : {};

    return {
      form: {
        ...(typeof form.id === "number" ? { id: form.id } : {}),
        title: form.title,
        description: form.description,
        steps_attributes: (form.sections ?? []).reduce<Record<string, unknown>>(
          (stepsAcc, section: SectionType, sectionIndex) => {
            stepsAcc[sectionIndex] = {
              ...keepIdIfNumber(section.id),
              title: section.title,
              position: sectionIndex + 1,
              inputs_attributes: section.items.reduce<Record<string, unknown>>(
                (inputsAcc, item: ItemType, itemIndex) => {
                  inputsAcc[itemIndex] = {
                    ...keepIdIfNumber(item.id),
                    label: item.label,
                    name: item.id, 
                    position: itemIndex + 1,
                    input_config_type: typeMap[item.type] ?? item.type,
                    input_config_attributes: buildAttributes(item),
                  };
                  return inputsAcc;
                },
                {}
              ),
            };
            return stepsAcc;
          },
          {}
        ),
      },
    };
  };

  const buildAttributes = (item: ItemType) => {
    const baseAttributes: Record<string, any> = {
      required: item.required ?? false,
    };

    switch (item.type) {
      case "text":
        return {
          ...baseAttributes,
          // placeholder:
          //   item.placeholder || `Ingrese ${item.label.toLowerCase()}`,
          // min_length: item.minLength || undefined,
          // max_length: item.maxLength || 255,
        };

      case "select":
        return {
          ...baseAttributes,
          options: (item.options || []).map((option, index) => ({
            id: index + 1,
            value: option.label,
          })), 
        };

      case "radio":
        return {
          ...baseAttributes,
          options: item.options || [],
        };

      case "checkbox":
        return {
          ...baseAttributes,
          options: (item.options || []).map((option, index) => ({
            id: index + 1,
            value: option.label,
          })), 
          // inline: item.inline ?? false,
          // select_all: item.selectAll ?? false,
          // min_selections: item.minSelections || undefined,
          // max_selections: item.maxSelections || undefined,
        };

      case "number":
        return {
          ...baseAttributes,
          allow_decimal: item.allow_decimal
          // min: item.min || undefined,
          // max: item.max || undefined,
          // step: item.step || 1,
          // default_value: item.defaultValue?.toString() || undefined,
        };

      case "date":
        return {
          ...baseAttributes,
          field_type: item.type
        };
      case "datetime": 
      case "time":
        return {
          ...baseAttributes,
          field_type: item.type,
        };

      case "signature":
        return {
          ...baseAttributes,
        };

      case "file":
        return {
          ...baseAttributes,
          // accept: item.accept || undefined,
          // max_size: item.maxSize || undefined,
        };

      default:
        return baseAttributes;
    }
  };

  const normalizeAndValidateForm = (form: FormType) => {
    if (!form.sections || form.sections.length === 0) {
      throw new Error("El formulario debe tener al menos una sección");
    }

    form.sections.forEach((section, index) => {
      if (!section.items || section.items.length === 0) {
        throw new Error(`La sección ${index + 1} debe tener al menos un campo`);
      }

      section.items.forEach((item) => {
        if (
          (item.type === "select" ||
            item.type === "radio" ||
            item.type === "checkbox") &&
          (!item.options || item.options.length === 0)
        ) {
          console.warn(
            `⚠️ Campo "${item.label}" de tipo ${item.type} no tiene opciones definidas`
          );
          item.options = [
            { id: 1, name: "Opción 1" },
            { id: 2, name: "Opción 2" },
          ];
        }
      });
    });

    return normalizeFormForBackend(form);
  };

  return {
    containers,
    sections,
    historyIndex,
    newForm,
    setNewForm,
    sensors,
    activeId,
    updateItem,
    removeItem,
    addSection,
    saveForm,
    handleUpdateForm,
    undo,
    redo,
    normalizeFormForBackend,
    removeSection,
    updateSection,
    handleDragEnd,
    handleDragStart,
    handleDragOver,
    isSortingContainer,
    collisionDetectionStrategy,
  };
};

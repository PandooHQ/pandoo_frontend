/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { arrayMove } from "@dnd-kit/sortable";
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
import type { SectionType } from "../types/SectionType";

interface DndInitialProps {
  sections: SectionType[];
  setSections: Dispatch<SetStateAction<SectionType[]>>
  containers: UniqueIdentifier[];
  setContainers: Dispatch<SetStateAction<UniqueIdentifier[]>>
}

export const useDnd = ({
  sections,
  setSections,
  containers,
  setContainers,
}: DndInitialProps) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const isSortingContainer =
    activeId != null ? containers.includes(activeId) : false;

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [sections]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

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
                      field_type: type,
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
                      field_type: active.data.current.type,
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

  const collisionDetectionStrategy = useCallback(
    (args: any) => {
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

  return {
    handleDragEnd,
    handleDragStart,
    handleDragOver,
    activeId,
    sensors,
    collisionDetectionStrategy,
    isSortingContainer,
  };
};

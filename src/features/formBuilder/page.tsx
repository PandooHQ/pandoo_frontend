"use client";

import { DndContext, DragOverlay, MeasuringStrategy, useDndContext } from "@dnd-kit/core";
import InputsMenuCard from "./components/InputsMenuCard";
import Section from "./components/sections/Section";
import { useFormBuilder } from "./hooks/useFormBuilder";
import { useState } from "react";

export default function Page() {
  const [menuKey, setMenuKey] = useState(() => Date.now());
  const {
    sensors,
    collisionDetectionStrategy,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    activeId,
    containers,
    sections,
    addSection,
    isSortingContainer,
    removeSection,
    updateSection,
    updateItem,
    removeItem
  } = useFormBuilder();
  const { active } = useDndContext();

  return (
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
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr_1fr]">
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
      </div>
    </DndContext>
  );
}

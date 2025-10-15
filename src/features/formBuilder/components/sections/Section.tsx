import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FolderPlus } from "lucide-react";
import { SortableSection } from "./SortableSection";
import type { SectionProps } from "../../types/SectionsPropsType";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { useState } from "react";

export default function Section({
  containers,
  sections,
  addSection,
  isSortingContainer,
  removeSection,
  updateSection,
  updateItem,
  removeItem,
  setSelectedInput
}: SectionProps) {
  const [selectedSection, setSelectedSection] = useState<UniqueIdentifier>();

  return (
    <SortableContext items={containers} strategy={verticalListSortingStrategy}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campos del Formulario</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={() => addSection()}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Agregar Sección
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[50vh] md:max-h-[60vh] lg:max-h-[calc(100vh-20rem)] overflow-y-auto">
          {containers.map((sectionId: UniqueIdentifier) => {
            const section = sections?.find((s) => s.id === sectionId);
            if (!section) return null;

            return (
              <SortableSection
                key={section.id}
                section={section}
                isSortingContainer={isSortingContainer}
                removeSection={() => removeSection(section.id)}
                updateSection={updateSection}
                updateItem={updateItem}
                removeItem={removeItem}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                setSelectedInput={setSelectedInput}
              />
            );
          })}
        </CardContent>
      </Card>
    </SortableContext>
  );
}

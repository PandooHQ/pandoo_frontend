import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { actionLabels, allPermissions } from "../../constant/permissions";

interface Props {
  handlePermissionSelect: (permissionId: string, isSelected: boolean) => void;
  selectedPermissions: string[];
  setCurrentStep: (step: number) => void;
}

export default function PermissionsConfiguration({
  handlePermissionSelect,
  selectedPermissions,
  setCurrentStep,
}: Props) {
  const isPermissionSelected = (subject: string, action: string) => {
    return selectedPermissions.includes(`${subject}.${action}`);
  };

  const isSubjectFullySelected = (subject: string, actions: string[]) => {
    return actions.every((action) => isPermissionSelected(subject, action));
  };

  const handleSubjectToggle = (
    subject: string,
    actions: string[],
    checked: boolean
  ) => {
    actions.forEach((action) => {
      const permissionId = `${subject}.${action}`;
      handlePermissionSelect(permissionId, checked);
    });
  };

  const getSelectedCount = (subject: string, actions: string[]) => {
    return actions.filter((action) => isPermissionSelected(subject, action))
      .length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permisos del Rol</CardTitle>
        <CardDescription>
          Selecciona los permisos que tendrá este rol. Puedes seleccionar
          permisos específicos o categorías completas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {allPermissions.map((category) => {
            const Icon = category.icon;
            const selectedCount = getSelectedCount(
              category.subject,
              category.actions
            );
            const isFullySelected = isSubjectFullySelected(
              category.subject,
              category.actions
            );
            const isPartiallySelected = selectedCount > 0 && !isFullySelected;

            return (
              <div
                key={category.subject}
                className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-0.5">
                      {/*
                        Use a ref to set indeterminate state on the Checkbox input element
                      */}
                      <Checkbox
                        id={`category-${category.subject}`}
                        checked={isFullySelected}
                        onCheckedChange={(checked) =>
                          handleSubjectToggle(
                            category.subject,
                            category.actions,
                            checked as boolean
                          )
                        }
                        ref={(el) => {
                          if (el) {
                            const input = el.querySelector(
                              'input[type="checkbox"]'
                            );
                            if (input)
                              (input as HTMLInputElement).indeterminate =
                                isPartiallySelected;
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon className="h-5 w-5 text-primary" />
                        <Label
                          htmlFor={`category-${category.subject}`}
                          className="text-lg font-semibold cursor-pointer"
                        >
                          {category.label}
                        </Label>
                        {selectedCount > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedCount} / {category.actions.length}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ml-9">
                  {category.actions.map((action) => {
                    const permissionId = `${category.subject}.${action}`;
                    return (
                      <div
                        key={permissionId}
                        className="flex items-center space-x-2 p-2 rounded border border-transparent hover:border-border hover:bg-muted/30 transition-colors"
                      >
                        <Checkbox
                          id={permissionId}
                          checked={isPermissionSelected(
                            category.subject,
                            action
                          )}
                          onCheckedChange={(checked) =>
                            handlePermissionSelect(
                              permissionId,
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor={permissionId}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {actionLabels[action]}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {selectedPermissions.slice(0, 10).map((permission) => {
          const [subject, action] = permission.split(".");

          const category = allPermissions.find((p) => p.subject === subject);
          const subjectLabel = category ? category.label : subject;

          const actionLabel = actionLabels[action] || action;

          return (
            <Badge key={permission} variant="secondary" className="ml-2">
              {subjectLabel}: {actionLabel}
            </Badge>
          );
        })}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Roles
          </Button>
          <Button
            onClick={() => setCurrentStep(2)}
            disabled={selectedPermissions.length === 0}
          >
            Siguiente: Asignar Usuarios
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  FormInput,
  Signature,
  X,
  Filter,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getForms } from "@/shared/api/getForms";
import { getFormResponses } from "./services/getFormResponses";
import { exportData } from "./services/exportData";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "react-i18next";
import { DropdownMenuDialog } from "./components/DropdownMenuDialog";
import MobileFormInfo from "../../shared/components/MobileFormInfo";
import { DatePicker } from "@/shared/components/DatePicker";

export default function FormDataPage() {
  const { t } = useTranslation();
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);

  const { data: forms } = useQuery({
    queryKey: ["forms"],
    queryFn: getForms,
  });

  const [tempStartDate, setTempStartDate] = useState<string>("");
  const [tempEndDate, setTempEndDate] = useState<string>("");
  
  const [appliedStartDate, setAppliedStartDate] = useState<string>("");
  const [appliedEndDate, setAppliedEndDate] = useState<string>("");
  
  const firstFormId = selectedFormId ?? forms?.[0]?.id ?? 0;
  const [selectedResponseId, setSelectedResponseId] = useState<number | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);

  const { data: formResponses } = useQuery({
    queryKey: ["forms", `${firstFormId}`, "responses"],
    queryFn: () => getFormResponses(firstFormId),
    enabled: !!firstFormId,
  });

  const handleFormChange = (formId: string) => {
    setSelectedFormId(Number(formId));
  };

  const handleApplyFilter = () => {
    setAppliedStartDate(tempStartDate);
    setAppliedEndDate(tempEndDate);
  };

  const handleClearFilter = () => {
    setTempStartDate("");
    setTempEndDate("");
    setAppliedStartDate("");
    setAppliedEndDate("");
  };

  const filteredSubmissions = useMemo(() => {
    if (!formResponses?.submissions) return [];
    return formResponses.submissions.filter(
      (s: { created_at: string | number | Date }) => {
        const createdAt = new Date(s.created_at);
        const afterStart = appliedStartDate ? createdAt >= new Date(appliedStartDate) : true;
        const beforeEnd = appliedEndDate ? createdAt <= new Date(appliedEndDate) : true;
        return afterStart && beforeEnd;
      }
    );
  }, [formResponses?.submissions, appliedStartDate, appliedEndDate]);

  const handleExport = async () => {
    try {
      const blob = await exportData(selectedFormId! || firstFormId, appliedStartDate, appliedEndDate);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `form_${selectedFormId || firstFormId}_responses.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("form_data.title")}
          </h1>
          <p className="text-muted-foreground">{t("form_data.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Select
            value={firstFormId.toString()}
            onValueChange={handleFormChange}
          >
            <SelectTrigger className="w-[200px]">
              <FormInput className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {forms?.map((form) => (
                <SelectItem key={form.id} value={form.id.toString()}>
                  {form.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => handleExport()}>
            {t("form_data.export")}
          </Button>
        </div>
      </div>

      {formResponses?.submissions && formResponses.submissions.length > 0 && (
        <>
          <div className="flex w-full justify-end">
            <div className="flex gap-2 items-center">
              <DatePicker
                title={t("form_data.filters.from")}
                value={tempStartDate}
                onChange={setTempStartDate}
              />

              <DatePicker
                title={t("form_data.filters.to")}
                value={tempEndDate}
                onChange={setTempEndDate}
              />
              <Button 
                onClick={handleApplyFilter}
                size="sm"
                variant="default"
                className="mt-6"
              >
                <Filter className="mr-2 h-4 w-4" />
                Aplicar
              </Button>
              {(appliedStartDate || appliedEndDate) && (
                <Button 
                  onClick={handleClearFilter}
                  size="sm"
                  variant="outline"
                  className="mt-6"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {filteredSubmissions.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User Email</TableHead>
                        <TableHead>Created At</TableHead>
                        {formResponses?.columns?.map(
                          (col: { id: number; label: string }) => (
                            <TableHead key={col.id}>{col.label}</TableHead>
                          )
                        )}
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map(
                        (s: {
                          id: number;
                          user: { email: string };
                          created_at: string | number | Date;
                          updated_at: string | number | Date;
                          answers: any[];
                        }) => (
                          <TableRow key={s.id} className="hover:bg-muted/50">
                            <TableCell>{s.id}</TableCell>
                            <TableCell>{s.user.email}</TableCell>
                            <TableCell>
                              {new Date(s.created_at).toLocaleString()}
                            </TableCell>
                            {formResponses.columns.map(
                              (col: {
                                id: number;
                                label: string;
                                type: string;
                              }) => {
                                const ans = s.answers.find(
                                  (a: { form_input_id: number }) =>
                                    a.form_input_id === col.id
                                );
                                let value: React.ReactNode = "-";

                                if (
                                  col.type.includes(
                                    "InputConfigs::SignatureInput"
                                  )
                                ) {
                                  value =
                                    ans && ans.value ? (
                                      <span className="flex items-center text-green-600 font-semibold gap-2">
                                        <Signature /> Firmado
                                      </span>
                                    ) : (
                                      <span className="flex items-center text-red-600 font-semibold gap-2">
                                        <X /> No firmado
                                      </span>
                                    );
                                } else if (ans) {
                                  if (Array.isArray(ans.value)) {
                                    value = (
                                      <ul className="list-disc list-inside">
                                        {ans.value.map(
                                          (v: string | number, i: number) => (
                                            <li key={i}>{v}</li>
                                          )
                                        )}
                                      </ul>
                                    );
                                  } else if (
                                    typeof ans.value === "string" ||
                                    typeof ans.value === "number"
                                  ) {
                                    value = ans.value;
                                  }
                                }

                                return (
                                  <TableCell key={col.id}>{value}</TableCell>
                                );
                              }
                            )}
                            <TableCell>
                              <DropdownMenuDialog
                                formId={s.id}
                                setSelectedResponseId={setSelectedResponseId}
                                setOpenModal={setOpenModal}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">
                No se encontraron resultados con los filtros aplicados
              </h3>
              <Button 
                onClick={handleClearFilter}
                variant="outline"
                className="mt-4"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </>
      )}
      
      {(!formResponses?.submissions || formResponses.submissions.length === 0) && (
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t("form_data.not_found")}</h3>
        </div>
      )}

      <MobileFormInfo
        open={openModal}
        onClose={() => setOpenModal(false)}
        formId={selectedResponseId!}
      />
    </div>
  );
}
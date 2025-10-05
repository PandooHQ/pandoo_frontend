/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  User,
  Settings,
  FormInput,
  Signature,
  X,
} from "lucide-react";
import { useMemo, useState} from "react";
import { getForms } from "@/shared/api/getForms";
import { getFormResponses } from "./services/getFormResponses";
import { exportData } from "./services/exportData";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "react-i18next";

export default function FormDataPage() {
  const { t } = useTranslation();
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);

  const { data: forms } = useQuery({
    queryKey: ["forms"],
    queryFn: getForms,
  });

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const firstFormId = selectedFormId ?? forms?.[0]?.id ?? 0;

  const { data: formResponses } = useQuery({
    queryKey: ["forms", `${firstFormId}`, "responses"],
    queryFn: () => getFormResponses(firstFormId),
    enabled: !!firstFormId,
  });

  console.log(formResponses)

  const handleFormChange = (formId: string) => {
    setSelectedFormId(Number(formId));
  };

  const filteredSubmissions = useMemo(() => {
    if (!formResponses?.submissions) return [];
    return formResponses.submissions.filter((s: { created_at: string | number | Date; }) => {
      const createdAt = new Date(s.created_at);
      const afterStart = startDate ? createdAt >= new Date(startDate) : true;
      const beforeEnd = endDate ? createdAt <= new Date(endDate) : true;
      return afterStart && beforeEnd;
    });
  }, [formResponses?.submissions, startDate, endDate]);

  const handleExport = async () => {
    const blob = await exportData(selectedFormId! || firstFormId);
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
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("form_data.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("form_data.subtitle")}
          </p>
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
          <Button onClick={() => handleExport()}>{t("form_data.export")}</Button>
        </div>
      </div>

      {/* Metrics */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("form_data.metrics.total_submissions.title")}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formResponses?.total_submissions ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("form_data.metrics.total_submissions.subtitle")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("form_data.metrics.active_users.title")}
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formResponses?.active_users ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("form_data.metrics.active_users.subtitle")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("form_data.metrics.completion_rate.title")}
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formResponses
                ? Math.round(
                    (formResponses.total_submissions /
                      formResponses.total_submissions) *
                      100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {t("form_data.metrics.completion_rate.subtitle")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <div className="flex w-full justify-end">
        <div className="flex gap-2 items-center">
          <label>{t("form_data.filters.from")}</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-1"
          />
          <label>{t("form_data.filters.to")}</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-1"
          />
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>Created At</TableHead>
                  {formResponses?.columns?.map((col: {id:number, label: string}) => (
                    <TableHead key={col.id}>{col.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((s: { id: number; user: { email: string }; created_at: string | number | Date; updated_at: string | number | Date; answers: any[]; }) => (
                  <TableRow key={s.id} className="hover:bg-muted/50">
                    <TableCell>{s.id}</TableCell>
                    <TableCell>{s.user.email}</TableCell>
                    <TableCell>
                      {new Date(s.created_at).toLocaleString()}
                    </TableCell>
                    {formResponses.columns.map((col: {id:number, label:string}) => {
                      const ans = s.answers.find(
                        (a: {form_input_id:number}) => a.form_input_id === col.id
                      );
                      let value: React.ReactNode = "-";

                      if (col.label.toLowerCase().includes("firma")) {
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
                          value = ans.value.join(", ");
                        } else if (typeof ans.value === "string") {
                          value = ans.value;
                        }
                      }

                      return <TableCell key={col.id}>{value}</TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {filteredSubmissions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No submissions found</h3>
          <p className="text-muted-foreground">Try changing the filters</p>
        </div>
      )}
    </div>
  );
}

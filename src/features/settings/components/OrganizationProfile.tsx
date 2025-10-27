import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Mail,
  Phone,
  Globe,
  FileText,
  IdCard,
  MapPinHouse,
  Building2,
  FilePenLine,
  Image,
} from "lucide-react";
import { type Dispatch, type SetStateAction, type ChangeEvent } from "react";

interface OrganizationData {
  id: string;
  name: string;
  business_name: string;
  rut: string;
  address: string;
  phone_number: string;
  email: string;
  website: string;
  health_resolution: string;
  sag_resolution: string;
  technical_representative_name: string;
  technical_representative_rut: string;
  additional_info: string;
  logo: string;
}

interface Props {
  isEditing: boolean;
  organizationFormData: OrganizationData;
  setOrganizationFormData: Dispatch<SetStateAction<OrganizationData>>;
  setOrgLogoFile: Dispatch<SetStateAction<File | null>>;
}

const OrganizationProfile = ({
  isEditing,
  organizationFormData,
  setOrganizationFormData,
  setOrgLogoFile,
}: Props) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOrganizationFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setOrgLogoFile(file);
    setOrganizationFormData((prev) => ({
      ...prev,
    }));
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Datos básicos de la organización</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={organizationFormData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_name">Razón Social</Label>
                <Input
                  id="business_name"
                  name="business_name"
                  value={organizationFormData.business_name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rut">RUT</Label>
                <Input
                  id="rut"
                  name="rut"
                  value={organizationFormData.rut}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  value={organizationFormData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                {(organizationFormData.logo) && (
                  <img
                    src={organizationFormData.logo}
                    alt="Logo"
                    className="w-24 h-24 object-contain border rounded mb-2"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Nombre</p>
                  <p className="text-sm text-muted-foreground">
                    {organizationFormData.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Razón Social</p>
                  <p className="text-sm text-muted-foreground">
                    {organizationFormData.business_name || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <IdCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">RUT</p>
                  <p className="text-sm text-muted-foreground">
                    {organizationFormData.rut || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <MapPinHouse className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Dirección</p>
                  <p className="text-sm text-muted-foreground">
                    {organizationFormData.address || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Image className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Logo</p>
                    <p className="text-xs text-muted-foreground">
                      Imagen representativa de la organización
                    </p>
                  </div>
                </div>

                {organizationFormData.logo ? (
                  <div className="flex items-center justify-center w-24 h-24 border rounded-xl bg-background shadow-sm overflow-hidden">
                    <img
                      src={organizationFormData.logo}
                      alt="Logo de la organización"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-24 h-24 border rounded-xl bg-muted text-muted-foreground text-sm italic">
                    Sin logo
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* === Información Corporativa === */}
      <Card>
        <CardHeader>
          <CardTitle>Información Corporativa</CardTitle>
          <CardDescription>
            Detalles administrativos y de contacto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={organizationFormData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Teléfono</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={organizationFormData.phone_number}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <Input
                  id="website"
                  name="website"
                  value={organizationFormData.website}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="health_resolution">Resolución Sanitaria</Label>
                <Input
                  id="health_resolution"
                  name="health_resolution"
                  value={organizationFormData.health_resolution}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sag_resolution">Resolución SAG</Label>
                <Input
                  id="sag_resolution"
                  name="sag_resolution"
                  value={organizationFormData.sag_resolution}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technical_representative_name">
                  Representante Técnico
                </Label>
                <Input
                  id="technical_representative_name"
                  name="technical_representative_name"
                  value={organizationFormData.technical_representative_name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technical_representative_rut">
                  RUT Representante Técnico
                </Label>
                <Input
                  id="technical_representative_rut"
                  name="technical_representative_rut"
                  value={organizationFormData.technical_representative_rut}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_info">Información Adicional</Label>
                <Textarea
                  id="additional_info"
                  name="additional_info"
                  value={organizationFormData.additional_info}
                  onChange={handleChange}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {organizationFormData.email || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Teléfono</p>
                  <p className="text-sm text-muted-foreground">
                    {organizationFormData.phone_number || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Sitio Web</p>
                  <p className="text-sm text-muted-foreground">
                    {organizationFormData.website || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <FilePenLine className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Información Adicional</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {organizationFormData.additional_info || "—"}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationProfile;
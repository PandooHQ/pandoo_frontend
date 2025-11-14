import { useEffect, useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Edit, Save, X, Upload } from "lucide-react";

import { useAuthStore } from "@/shared/stores/auth";
import { updateUser } from "@/shared/api/updateUser";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import UserProfile from "./components/UserProfile";
import { usePositions } from "@/shared/hooks/usePositions";
import { useDepartments } from "@/shared/hooks/useDepartments";
import { useOrganization } from "./hooks/useOrganization";
import OrganizationProfile from "./components/OrganizationProfile";
import { updateOrganization } from "./services/updateOrganization";

export default function SettingsPage() {
  const { user: userData, updateUser: updateState } = useAuthStore();
  const { positions } = usePositions();
  const { departments } = useDepartments();
  const { organization } = useOrganization();

  const getPositionName = (
    position?: string | { name: string; id: number }
  ) => {
    return typeof position === "object" ? position?.name : position;
  };

  const getDepartmentName = (
    department?: string | { name: string; id: number }
  ) => {
    return typeof department === "object" ? department?.name : department;
  };

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    id: userData?.id || 0,
    first_name: userData?.first_name || "",
    last_name: userData?.last_name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    location: userData?.location || "",
    position_id: userData?.position_id || null,
    department_id: userData?.department_id || null,
    position: getPositionName(userData?.position) || "",
    department: getDepartmentName(userData?.department) || "",
    profile_picture: userData?.profile_picture || "/placeholder.svg",
    created_at: userData?.created_at,
    status: userData?.status,
  });

  const [orgFormData, setOrgFormData] = useState({
    id: "",
    name: "",
    business_name: "",
    rut: "",
    address: "",
    phone_number: "",
    email: "",
    website: "",
    health_resolution: "",
    sag_resolution: "",
    technical_representative_name: "",
    technical_representative_rut: "",
    additional_info: "",
    logo: "",
  });

  const [orgLogoFile, setOrgLogoFile] = useState<File | null>(null);

  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [activeTab, setActiveTab] = useState("user");

  useEffect(() => {
    setOrgFormData({
      id: organization?.id || "",
      name: organization?.name || "",
      business_name: organization?.business_name || "",
      rut: organization?.rut || "",
      address: organization?.address || "",
      phone_number: organization?.phone_number || "",
      email: organization?.email || "",
      website: organization?.website || "",
      health_resolution: organization?.health_resolution || "",
      sag_resolution: organization?.sag_resolution || "",
      technical_representative_name:
        organization?.technical_representative_name || "",
      technical_representative_rut:
        organization?.technical_representative_rut || "",
      additional_info: organization?.additional_info || "",
      logo: organization?.logo || "",
    });
  }, [organization]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProfilePicture(e.target.files[0]);
      setFormData({
        ...formData,
        profile_picture: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const user = {
    id: formData?.id,
    name: `${formData?.first_name} ${formData?.last_name}`,
    email: formData?.email,
    phone: formData?.phone || "+56 9 8765 4321",
    position: formData?.position,
    department: formData?.department,
    status: formData?.status,
    joinDate: formData?.created_at,
    location: formData?.location,
    avatar: formData?.profile_picture,
  };

  const handleSave = async () => {
    const resp = await updateUser(formData.id, {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      position_id: formData.position_id,
      department_id: formData.department_id,
      location: formData.location,
      profile_picture: profilePicture || undefined,
    });

    updateState(resp.data);
    setIsEditingUser(false);
  };

  const handleCancel = () => {
    setFormData(userData! as typeof formData);
    setIsEditingUser(false);
  };

  const handleSaveOrg = async () => {
    try {
      const form = new FormData();
      form.append("organization[name]", orgFormData.name);
      form.append(
        "organization[business_name]",
        orgFormData.business_name || ""
      );
      form.append("organization[rut]", orgFormData.rut || "");
      form.append("organization[address]", orgFormData.address || "");
      form.append("organization[phone_number]", orgFormData.phone_number || "");
      form.append("organization[email]", orgFormData.email || "");
      form.append("organization[website]", orgFormData.website || "");
      form.append(
        "organization[health_resolution]",
        orgFormData.health_resolution || ""
      );
      form.append(
        "organization[sag_resolution]",
        orgFormData.sag_resolution || ""
      );
      form.append(
        "organization[technical_representative_name]",
        orgFormData.technical_representative_name || ""
      );
      form.append(
        "organization[technical_representative_rut]",
        orgFormData.technical_representative_rut || ""
      );
      form.append(
        "organization[additional_info]",
        orgFormData.additional_info || ""
      );

      if (orgLogoFile) {
        form.append("organization[logo]", orgLogoFile);
      }

      const updatedOrg = await updateOrganization(form);
      setOrgFormData({
        ...updatedOrg,
      });
      setOrgLogoFile(updatedOrg.logo);
      setIsEditingOrg(false);
    } catch (error) {
      console.error("Error al actualizar la organización:", error);
    }
  };

  const handleCancelOrg = () => {
    setOrgFormData({
      id: organization?.id || "",
      name: organization?.name || "",
      business_name: organization?.business_name || "",
      rut: organization?.rut || "",
      address: organization?.address || "",
      phone_number: organization?.phone_number || "",
      email: organization?.email || "",
      website: organization?.website || "",
      health_resolution: organization?.health_resolution || "",
      sag_resolution: organization?.sag_resolution || "",
      technical_representative_name:
        organization?.technical_representative_name || "",
      technical_representative_rut:
        organization?.technical_representative_rut || "",
      additional_info: organization?.additional_info || "",
      logo: organization?.logo,
    });
    setIsEditingOrg(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 max-w-4xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={
                      formData.profile_picture instanceof File
                        ? URL.createObjectURL(formData.profile_picture)
                        : formData.profile_picture || "/placeholder.svg"
                    }
                    alt={user.name}
                  />

                  <AvatarFallback className="text-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditingUser && (
                  <>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute -bottom-2 -right-2 bg-white"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
              <div className="space-y-1 text-center md:text-left">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-base text-muted-foreground">
                  {positions.find((p) => p.id === formData.position_id)?.name ||
                    user.position}
                </p>
                <p className="text-sm text-muted-foreground">
                  {departments.find((d) => d.id === formData.department_id)
                    ?.name || user.department}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {activeTab === "user" ? (
                isEditingUser ? (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditingUser(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Usuario
                  </Button>
                )
              ) : activeTab === "organization" ? (
                isEditingOrg ? (
                  <>
                    <Button variant="outline" onClick={handleCancelOrg}>
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveOrg}>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditingOrg(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Empresa
                  </Button>
                )
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="lg:w-[400px] w-[300px]">
          <TabsTrigger value="user">Usuario</TabsTrigger>
          <TabsTrigger value="organization">Empresa</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <UserProfile
            departments={departments}
            positions={positions}
            formData={formData}
            user={user}
            isEditing={isEditingUser}
            setFormData={setFormData}
          />
        </TabsContent>
        <TabsContent value="organization">
          <OrganizationProfile
            isEditing={isEditingOrg}
            organizationFormData={orgFormData}
            setOrganizationFormData={setOrgFormData}
            setOrgLogoFile={setOrgLogoFile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

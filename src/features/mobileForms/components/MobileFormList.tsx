import { useQueryClient } from "@tanstack/react-query";
import type { MobileForm } from "../types/MobileFormType";
import MobileFormCard from "./MobileFormCard";
import { getFormReponseById } from "../services/getUserResponseById";
import MobileFormInfo from "./MobileFormInfo";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  mobileForms: MobileForm[];
}

const MobileFormList = ({ mobileForms }: Props) => {
  const [openSent, setOpenSent] = useState(false);
  const queryClient = useQueryClient();
  const { lang } = useParams();

  const router = useNavigate();

  const [selectedForm, setSelectedForm] = useState<MobileForm | null>(null);

  const prefetchForm = async (id: number) => {
    await queryClient.prefetchQuery({
      queryKey: ["form_response", id],
      queryFn: () => getFormReponseById(id),
      staleTime: 1000 * 60 * 5,
    });
  };

  const handleForm = (form: MobileForm) => {
    if (form.status === "sent") {
      setSelectedForm(form);
      setOpenSent(true);
      return;
    }
    router(`/${lang}/forms/mobile-forms/${form.id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
      {mobileForms.length > 0 ? (
        mobileForms.map((form) => (
          <MobileFormCard
            key={form.id}
            mobileForm={form}
            onMouseEnter={() => prefetchForm(form.id)}
            onClick={() => handleForm(form)}
          />
        ))
      ) : (
        <p>No hay formularios</p>
      )}

      <MobileFormInfo
        open={openSent}
        onClose={() => setOpenSent(false)}
        formId={selectedForm?.id || 0}  
      />
    </div>
  );
};

export default MobileFormList;

interface InstructionFormInputProps {
  field: {
    id: number;
    name: string;
    label: string;
    description?: string;
    image_url?: string;
  };
}

export const InstructionFormInput = ({ field }: InstructionFormInputProps) => {
  const { label, description, image_url } = field;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
      {label && (
        <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
      )}

      {description && (
        <div
          className="prose prose-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      {image_url && (
        <div className="mt-2">
          <img
            src={image_url}
            alt={label || "Instrucción"}
            className="max-w-full rounded-xl border border-gray-300"
          />
        </div>
      )}
    </div>
  );
};

interface BaseInput {
  label: string;
  name: string;
  position: number;
}

interface TextInput extends BaseInput {
  input_config_type: "InputConfigs::TextInput";
  input_config_attributes: {
    required: boolean;
  };
}

interface NumberInput extends BaseInput {
  input_config_type: "InputConfigs::NumberInput";
  input_config_attributes: {
    required: boolean;
  };
}

interface SelectInput extends BaseInput {
  input_config_type: "InputConfigs::SelectInput";
  input_config_attributes: {
    options: { id: number; name: string }[];
    required?: boolean;
  };
}

interface SignatureInput extends BaseInput {
  input_config_type: "InputConfigs::SignatureInput";
  input_config_attributes: {
    required: boolean;
  };
}

export type Input = TextInput | NumberInput | SelectInput | SignatureInput;

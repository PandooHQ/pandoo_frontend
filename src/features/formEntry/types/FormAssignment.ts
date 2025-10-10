export interface FormAssignment {
    id:          number;
    form_id:     number;
    title:       string;
    status:      string;
    form_status: string;
    description: string;
    updated_at:  string;
    steps:       Step[];
}

export interface Step {
    id:       number;
    title:    string;
    position: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sections: any[];
    inputs:   Input[];
}

export interface Input {
    id:             number;
    name:           string;
    label:          string;
    position:       number;
    type:           string;
    default_value?: null;
    required:       boolean;
    pattern?:       null;
    placeholder?:   null;
    max_length?:    null;
    min_length?:    null;
    field_type?:    string;
    options?:       Option[];
    multiple?:      boolean;
    include_blank?: boolean;
    searchable?:    boolean;
    min?:           null;
    max?:           null;
    step?:          string;
    allow_decimal?: boolean;
}

export interface Option {
    id:    number;
    value: string;
}


export interface AnswerResponse {
    type: string,
    value?: string | unknown,
    values? : {
        id: number
    }
}

export interface Answer {
    form_input_id: number,
    answer: AnswerResponse,
}

export interface FormResponse {
    form_assignment_id: number,
    status: string,
    answers: Answer[],
}

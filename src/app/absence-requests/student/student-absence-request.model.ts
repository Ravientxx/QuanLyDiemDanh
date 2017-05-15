export class StudentAbsenceRequest{
	constructor(
		public id: number,
		public code: string,
		public name: string,
		public reason: string,
		public from_to: string,
		public days: number,
		public submited_at: Date,
		public accepted_at: Date,
		public status: number
		){}
}
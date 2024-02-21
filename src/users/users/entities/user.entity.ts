
export class User {
  id: string
  name: string
  paternalSurname: string
  maternalSurname: string
  ci?: string | null
  phone?: string | null
  address?: string | null
  birthDate: Date
  gender: string
  email: string
  password: string
  role: string
  status: boolean
  createdAt: Date
  createdBy?: string | null
  updatedAt: Date
  updatedBy?: string | null
}

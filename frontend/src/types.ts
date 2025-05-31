export interface Education {
  qualification: string;
  specialization: string;
  yearOfPassout: string | null;
  percentage: string;
}

export interface IDProof {
  idType: string;
  idNumber: string;
}

export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  designation: string;
  gender: string;
  maritalStatus: string;
  email: string;
  mobileNumber: string;
  dob: string;
  currentAddress: string;
  currentState: string;
  currentPin: string;
  permanentAddress: string;
  permanentState: string;
  permanentPin: string;
  department: string;
  joiningDate: string;
  mothersName: string;
  isActive: boolean;
  educationList: Education[];
  idProofList: IDProof[];
}
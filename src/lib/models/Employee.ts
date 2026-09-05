export interface Employee {
    upn: string;
    email: string;
    emplid: string;
    username: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    jobTitleAlt: string;
    group: string;
    departmentCode: string;
    department: string;
    jobCode: number;
    extension: string;
    office: string;
    deskLocation: string;
    phone: string;
    mobile: string;
    supervisorUpn: string;
    secretaryUpns: string[]; 
    updateAction: string;
    lastUpdated: Date;
    fullName: string;
}

export const DefaultEmployee = {
    upn: '',
    email: '',
    emplid: '',
    username: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    jobTitleAlt: '',
    departmentCode: '',
    department: '',
    jobCode: '',
    extension: '',
    office: '',
    deskLocation: '',
    phone: '',
    mobile: '',
    supervisorId: '',
    secretariesCsv: '',
    updateAction: '',
    lastUpdated: new Date(),
    fullName: ''
};

export interface GitEmployee {
    fullName: string;
    emplid: string;
    upn: string;
    jobTitle: string;
}
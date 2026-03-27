interface Course {
    title: string;
    resp: string;
    level: 'Licence' | 'Master';
    target : string;
    location: string;
    hoursETD: number;
}

interface AcademicYear {
    year: string;
    contractType: 'ATER' | 'CDD';
    courses: Course[];
}
import { SubjectModel } from "../model/SubjectModel";

export function SubjectEntry({ subject }: { subject: SubjectModel }) {
  return (
    <div>
    <div className="center">
      <div className="header-text">{subject.name}</div>
      <div className="small-text">Semester: {subject.semester}</div>
    </div>
    <div className="small-text">{subject.description}</div>
  </div>
  );
}

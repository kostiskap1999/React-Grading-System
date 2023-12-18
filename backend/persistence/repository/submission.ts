import { TransactionManager } from "../../manager/transaction";
import { Submission } from "../entities/submission";
import { TestRepository } from './test'

export class SubmissionRepository {
  constructor(public transactionManager = TransactionManager.createTransaction()) {}

  private formatDate(date: Date) {
    let year = date.getFullYear()
    let month = (date.getMonth() + 1).toString().padStart(2, '0')
    let day = date.getDate().toString().padStart(2, '0')
    
    return year + '-' + month + '-' + day
  }

  async findByProjectId(projectId: number) {
    const tm = await this.transactionManager
    return (await tm.query(`SELECT * FROM submissions WHERE project_id = ?`, projectId) as any[])
      .map(submission => new Submission(submission))[0]
  }

  async findByProjectIdAndSubmiteeId(projectId: number, submiteeId: number) {
    const tm = await this.transactionManager
    return new Submission((await tm.query(`SELECT * FROM submissions WHERE project_id = ? AND submitee_id = ?`, projectId, submiteeId) as any[])[0])
  }

  async postSubmission(submission: any) {
    const tm = await this.transactionManager
    await tm.query(`INSERT INTO submissions (code, date, comment, submitee_id, project_id) VALUES (?, ?, ?, ?, ?)`, submission.code, this.formatDate(submission.date), submission.comment, submission.submitee_id, submission.project_id)
  }

  async patchSubmission(submission: any) {
    const tm = await this.transactionManager
    await tm.query(`UPDATE submissions SET code = ?, date = ?, grade = ?, comment = ? WHERE id = ?`, submission.code, this.formatDate(submission.date), submission.grade, submission.comment, submission.id)
  }
}
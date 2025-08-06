export class FeedbackResponseDto {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public ip: string,
    public message: string,
    public createdAt: Date,
    public feedbacksThemeId: number,
    public feedbacksTheme: {
      id: number;
      name: string;
    },
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.ip = ip;
    this.message = message;
    this.createdAt = createdAt;

    this.feedbacksTheme = {
      id: feedbacksTheme.id,
      name: feedbacksTheme.name,
    };
  }
}

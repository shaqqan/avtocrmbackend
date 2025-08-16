export class CustomerResponseDto {
  constructor(
    public id: number,
    public pinfl: number,
    public firstName: string | null,
    public lastName: string | null,
    public middleName: string | null,
    public phoneNumber: string | null,
    public address: string | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    this.id = id;
    this.pinfl = pinfl;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleName = middleName;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

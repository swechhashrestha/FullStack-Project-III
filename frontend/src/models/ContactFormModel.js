export class ContactFormModel {
  constructor(name = "", email = "", message = "") {
    this.name = name;
    this.email = email;
    this.message = message;
    this.isSent = false;
  }

  updateField(field, value) {
    if (Object.prototype.hasOwnProperty.call(this, field)) {
      this[field] = value;
    }
    return this.clone();
  }

  validate() {
    return (
      this.name.trim().length > 0 &&
      this.email.includes("@") &&
      this.message.trim().length > 0
    );
  }

  submit() {
    if (!this.validate()) {
      throw new Error("Invalid form submission data.");
    }
    console.log("Submitted Data:", {
      name: this.name,
      email: this.email,
      message: this.message,
    });
    const submitted = new ContactFormModel();
    submitted.isSent = true;
    return submitted;
  }

  clone() {
    const copy = new ContactFormModel(this.name, this.email, this.message);
    copy.isSent = this.isSent;
    return copy;
  }
}